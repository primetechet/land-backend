-- CreateEnum
CREATE TYPE "public"."UserType" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "public"."IdType" AS ENUM ('FAYDA_ID', 'GOVERNMENT_ID', 'TIN_NUMBER', 'PASSPORT');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "user_type" "public"."UserType" NOT NULL,
    "id_type" "public"."IdType" NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "email" TEXT,
    "code_hash" TEXT,
    "profile_image" TEXT,
    "code_expiration" TIMESTAMP(3),
    "require_password_change" BOOLEAN NOT NULL DEFAULT false,
    "username_verified" BOOLEAN NOT NULL DEFAULT false,
    "username_verified_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "active_status_updated_at" TIMESTAMP(3),
    "active_status_updated_by_id" TEXT,
    "status_update_note" TEXT,
    "is_suspended" BOOLEAN NOT NULL DEFAULT false,
    "suspended_status_updated_at" TIMESTAMP(3),
    "suspended_status_updated_by_id" TEXT,
    "suspended_status_update_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."employees" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "email" TEXT,
    "code_hash" TEXT,
    "profile_image" TEXT,
    "code_expiration" TIMESTAMP(3),
    "require_password_change" BOOLEAN NOT NULL DEFAULT false,
    "username_verified" BOOLEAN NOT NULL DEFAULT false,
    "username_verified_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "active_status_updated_at" TIMESTAMP(3),
    "active_status_updated_by_id" TEXT,
    "status_update_note" TEXT,
    "is_suspended" BOOLEAN NOT NULL DEFAULT false,
    "suspended_status_updated_at" TIMESTAMP(3),
    "suspended_status_updated_by_id" TEXT,
    "suspended_status_update_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."otp" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."login_histories" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "ip_address" TEXT NOT NULL,
    "lat" TEXT,
    "lng" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "login_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."employee_login_histories" (
    "id" TEXT NOT NULL,
    "is_successful" BOOLEAN NOT NULL DEFAULT true,
    "employee_id" TEXT NOT NULL,
    "ip_address" TEXT NOT NULL,
    "lat" TEXT,
    "lng" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_login_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."permission_actions" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT,
    "draft" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permission_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."permission_resources" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "draft" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permission_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "switchable" BOOLEAN NOT NULL DEFAULT false,
    "editable" BOOLEAN NOT NULL DEFAULT false,
    "draft" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."role_permission_resources" (
    "id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "permission_resource_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "role_permission_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."role_permission_resource_actions" (
    "id" TEXT NOT NULL,
    "permission_action_id" TEXT NOT NULL,
    "role_permission_resource_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "role_permission_resource_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_roles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "created_by_id" TEXT,
    "updated_by_id" TEXT,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."employee_roles" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "created_by_id" TEXT,
    "updated_by_id" TEXT,

    CONSTRAINT "employee_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."countries" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_json" JSONB NOT NULL DEFAULT '{}',
    "country_code" TEXT NOT NULL,
    "flag" TEXT,
    "nationality" TEXT NOT NULL,
    "nationality_json" JSONB NOT NULL DEFAULT '{}',
    "description" TEXT,
    "description_json" JSONB DEFAULT '{}',
    "draft" BOOLEAN NOT NULL DEFAULT false,
    "drafted_at" TIMESTAMP(3),
    "drafted_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "public"."users"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "employees_username_key" ON "public"."employees"("username");

-- CreateIndex
CREATE UNIQUE INDEX "employees_phone_number_key" ON "public"."employees"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "public"."employees"("email");

-- CreateIndex
CREATE UNIQUE INDEX "permission_actions_action_key" ON "public"."permission_actions"("action");

-- CreateIndex
CREATE UNIQUE INDEX "permission_resources_name_key" ON "public"."permission_resources"("name");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "public"."roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "role_permission_resources_permission_resource_id_role_id_key" ON "public"."role_permission_resources"("permission_resource_id", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "role_permission_resource_actions_role_permission_resource_i_key" ON "public"."role_permission_resource_actions"("role_permission_resource_id", "permission_action_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_role_id_user_id_key" ON "public"."user_roles"("role_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "employee_roles_role_id_employee_id_key" ON "public"."employee_roles"("role_id", "employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "countries_name_key" ON "public"."countries"("name");

-- CreateIndex
CREATE UNIQUE INDEX "countries_country_code_key" ON "public"."countries"("country_code");

-- CreateIndex
CREATE UNIQUE INDEX "countries_nationality_key" ON "public"."countries"("nationality");

-- AddForeignKey
ALTER TABLE "public"."otp" ADD CONSTRAINT "otp_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."login_histories" ADD CONSTRAINT "login_histories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."employee_login_histories" ADD CONSTRAINT "employee_login_histories_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."role_permission_resources" ADD CONSTRAINT "role_permission_resources_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."role_permission_resources" ADD CONSTRAINT "role_permission_resources_permission_resource_id_fkey" FOREIGN KEY ("permission_resource_id") REFERENCES "public"."permission_resources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."role_permission_resource_actions" ADD CONSTRAINT "role_permission_resource_actions_permission_action_id_fkey" FOREIGN KEY ("permission_action_id") REFERENCES "public"."permission_actions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."role_permission_resource_actions" ADD CONSTRAINT "role_permission_resource_actions_role_permission_resource__fkey" FOREIGN KEY ("role_permission_resource_id") REFERENCES "public"."role_permission_resources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."employee_roles" ADD CONSTRAINT "employee_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."employee_roles" ADD CONSTRAINT "employee_roles_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
