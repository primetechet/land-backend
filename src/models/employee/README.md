# Employee Management

This module provides comprehensive employee management functionality with branch-based permissions.

## Features

- **CRUD Operations**: Create, read, update, and delete employees
- **Branch-based Permissions**: Employees can only manage users within their assigned branch
- **Super Admin Override**: Super admins can manage employees across all branches
- **Role-based Access Control**: Uses the existing permission system with decorators
- **Password Security**: Automatic password hashing with bcrypt
- **Unique Constraints**: Username, phone number, and email uniqueness validation

## API Endpoints

### POST /employees

Create a new employee

- **Permission Required**: `employee:create`
- **Super Admin**: Can create employees for any branch
- **Branch Employee**: Can only create employees for their own branch

### GET /employees

Get all employees

- **Permission Required**: `employee:read`
- **Super Admin**: Can view all employees or filter by branch
- **Branch Employee**: Can only view employees from their branch

### GET /employees/:id

Get a specific employee

- **Permission Required**: `employee:read_one`
- **Super Admin**: Can view any employee
- **Branch Employee**: Can only view employees from their branch

### PATCH /employees/:id

Update an employee

- **Permission Required**: `employee:update`
- **Super Admin**: Can update any employee and change branch assignment
- **Branch Employee**: Can only update employees from their branch (cannot change branch)

### DELETE /employees/:id

Delete an employee

- **Permission Required**: `employee:delete`
- **Super Admin**: Can delete any employee
- **Branch Employee**: Can only delete employees from their branch
- **Self-deletion Prevention**: Employees cannot delete themselves

## Permission System

The module uses the existing permission system with the following resources and actions:

- **Resource**: `employee`
- **Actions**: `create`, `read`, `read_one`, `update`, `delete`

Permissions are enforced through:

1. **Guards**: `EmployeeAuthGuard` ensures authentication
2. **Decorators**: `@Resource` decorators define required permissions
3. **Service Logic**: Branch-based access control in service methods

## Branch Assignment

- **Super Admins**: Can assign employees to any branch or leave them unassigned
- **Branch Employees**: Can only create employees for their own branch
- **Branch Filtering**: Super admins can filter employee lists by branch ID

## Data Validation

- **Username**: Must be unique across all employees
- **Phone Number**: Must be unique across all employees
- **Email**: Must be unique if provided
- **Password**: Must meet complexity requirements (8+ chars, uppercase, lowercase, number, special char)

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt with salt rounds of 10
- **Audit Trail**: Tracks who created and updated each employee
- **Self-deletion Prevention**: Employees cannot delete their own accounts
- **Branch Isolation**: Branch employees cannot access data from other branches

## Usage Examples

### Creating an Employee (Super Admin)

```json
POST /employees
{
  "name": "John Doe",
  "username": "john.doe",
  "password": "StrongP@ss123",
  "phone_number": "+251912345678",
  "email": "john.doe@example.com",
  "branch_id": "uuid-of-branch",
  "require_password_change": true,
  "is_active": true
}
```

### Creating an Employee (Branch Employee)

```json
POST /employees
{
  "name": "Jane Smith",
  "username": "jane.smith",
  "password": "StrongP@ss123",
  "phone_number": "+251912345679",
  "email": "jane.smith@example.com",
  "require_password_change": false,
  "is_active": true
}
```

Note: `branch_id` is automatically set to the current employee's branch.

### Filtering Employees by Branch (Super Admin Only)

```
GET /employees?branchId=uuid-of-branch
```

## Error Handling

The module provides comprehensive error handling for:

- **Permission Denied**: 403 Forbidden for insufficient permissions
- **Not Found**: 404 for non-existent employees
- **Conflict**: 409 for duplicate username, phone, or email
- **Validation Errors**: 400 for invalid input data

## Dependencies

- `@nestjs/common`: Core NestJS functionality
- `@nestjs/swagger`: API documentation
- `bcryptjs`: Password hashing
- `class-transformer`: DTO transformation
- `nestjs-i18n`: Internationalization
- `prisma`: Database operations
