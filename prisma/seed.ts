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

  console.log('✅ Seeding finished!');
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
