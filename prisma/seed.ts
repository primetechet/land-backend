import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export enum RESOURCE {
  CONFIGURATION = 'configuration',
  COMPLAINT = 'complaint',
  FEEDBACK = 'feedback',
  EMPLOYEE = 'employee',
  USER = 'user',
}

export enum ACTIONS {
  READ = 'Read',
  READ_ONE = 'ReadOne',
  CREATE = 'Create',
  UPDATE = 'Update',
  DELETE = 'Delete',
  REJECT = 'Reject',
  APPROVE = 'Approve',
  VERIFY = 'Verify',
  VALIDATE = 'Validate',
  AUTHORIZE = 'Authorize',
  CLOSE = 'Close',
  RELEASE = 'Release',
  FLAG = 'Flag',
  CHECK_IN = 'CheckIn',
  CANCEL = 'Cancel',
}

async function main() {
  console.log('🌱 Start seeding...');

  // 1️⃣ Insert Permission Resources
  const resources = await Promise.all(
    Object.values(RESOURCE).map((res) =>
      prisma.permissionResource.upsert({
        where: { name: res },
        update: {},
        create: { name: res },
      }),
    ),
  );

  // 2️⃣ Insert Permission Actions
  const actions = await Promise.all(
    Object.values(ACTIONS).map((act) =>
      prisma.permissionAction.upsert({
        where: { action: act },
        update: {},
        create: { action: act },
      }),
    ),
  );

  // 3️⃣ Create admin role
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Administrator role with full access',
      switchable: false,
      editable: false,
    },
  });

  // 4️⃣ Link admin to all resources & actions
  for (const resource of resources) {
    const roleResource = await prisma.rolePermissionResource.upsert({
      where: {
        permission_resource_id_role_id: {
          role_id: adminRole.id,
          permission_resource_id: resource.id,
        },
      },
      update: {},
      create: {
        role_id: adminRole.id,
        permission_resource_id: resource.id,
      },
    });

    for (const action of actions) {
      await prisma.rolePermissionResourceAction.upsert({
        where: {
          role_permission_resource_id_permission_action_id: {
            role_permission_resource_id: roleResource.id,
            permission_action_id: action.id,
          },
        },
        update: {},
        create: {
          role_permission_resource_id: roleResource.id,
          permission_action_id: action.id,
        },
      });
    }
  }

  // 5️⃣ Create an admin employee
  const hashedPassword = await bcrypt.hash('@Password1', 10);

  const adminEmployee = await prisma.employee.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      name: 'System Administrator',
      username: 'admin',
      password: hashedPassword,
      phone_number: '0000000000',
      email: 'admin@example.com',
      require_password_change: true,
      is_active: true,
    },
  });

  // 6️⃣ Link admin employee to admin role
  await prisma.employeeRole.upsert({
    where: {
      role_id_employee_id: {
        role_id: adminRole.id,
        employee_id: adminEmployee.id,
      },
    },
    update: {},
    create: {
      role_id: adminRole.id,
      employee_id: adminEmployee.id,
    },
  });
  await seedGeographyAndTitleDeeds();
  console.log('✅ Seeding finished!');
}

async function seedGeographyAndTitleDeeds() {
  console.log(
    '🌱 Seeding countries, regions, districts, woredas, branches, title deed services...',
  );

  // 1️⃣ Country
  const ethiopia = await prisma.country.upsert({
    where: { name: 'Ethiopia' },
    update: {},
    create: {
      name: 'Ethiopia',
      country_code: 'ET',
      nationality: 'Ethiopian',
    },
  });

  // 2️⃣ Region
  const addisAbabaRegion = await prisma.region.upsert({
    where: { name: 'Addis Ababa' },
    update: {},
    create: {
      name: 'Addis Ababa',
      zip_code: '1000',
      country_id: ethiopia.id,
    },
  });

  // 3️⃣ District
  const district1 = await prisma.district.upsert({
    where: {
      name_region_id: { name: 'Lideta', region_id: addisAbabaRegion.id },
    },
    update: {},
    create: {
      name: 'Lideta',
      zip_code: '1001',
      region_id: addisAbabaRegion.id,
    },
  });

  // 4️⃣ Woreda
  const woreda1 = await prisma.woreda.upsert({
    where: {
      name_district_id: { name: 'Woreda 1', district_id: district1.id },
    },
    update: {},
    create: {
      name: 'Woreda 1',
      zip_code: '10001',
      district_id: district1.id,
    },
  });

  // 5️⃣ Branch
  const branch1 = await prisma.branch.upsert({
    where: { name: 'Main Branch' },
    update: {},
    create: {
      name: 'Main Branch',
      code: 'MB001',
      woreda_id: woreda1.id,
    },
  });

  // 6️⃣ Organization Type
  const orgType = await prisma.organizationType.upsert({
    where: { name: 'Government' },
    update: {},
    create: { name: 'Government' },
  });

  // 7️⃣ Disability Status
  const disabilityStatus = await prisma.disabilityStatus.upsert({
    where: { name: 'None' },
    update: {},
    create: { name: 'None' },
  });

  // 8️⃣ Title Deed Services
  const landRegistrationService = await prisma.titleDeedService.upsert({
    where: { name: 'Land Registration' },
    update: {},
    create: {
      name: 'Land Registration',
      description: 'Service for registering land ownership',
    },
  });

  // 9️⃣ Title Deed Service Branch mapping
  await prisma.titleDeedServiceBranch.upsert({
    where: {
      title_deed_service_id_branch_id: {
        title_deed_service_id: landRegistrationService.id,
        branch_id: branch1.id,
      },
    },
    update: {},
    create: {
      title_deed_service_id: landRegistrationService.id,
      branch_id: branch1.id,
    },
  });

  //  🔟 Title Deed Service Requirements
  // await prisma.titleDeedServiceRequirement.upsert({
  //   where: {
  //     branch_id_name: {
  //       branch_id: branch1.id,
  //       name: 'Proof of ownership',
  //     },
  //   },
  //   update: {},
  //   create: {
  //     branch_id: branch1.id,
  //     name: 'Proof of ownership',
  //   },
  // });

  console.log('✅ Geography & Title Deed Services seeded!');
}

main()
  .catch((e) => {
    console.error('❌ Error while seeding', e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('🔌 Disconnecting Prisma...');
    await prisma.$disconnect();
  });
