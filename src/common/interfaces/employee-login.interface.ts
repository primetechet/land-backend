export interface IUserRole {
  role: {
    id: string;
    name: string;
    rolePermissionResources: {
      rolePermissionResourceActions: {
        permissionAction: {
          id: string;
          action: any;
        };
      }[];
      permissionResource: {
        name: string;
      };
    }[];
  };
}

export interface IEmployeeLogin {
  id: string;
  name?: string | null;
  username: string;
  email?: string | null;
  require_password_change: boolean;
  username_verified: boolean;
  userPreferences?: {
    language: {
      id: string;
      name: string;
      code: string;
    };
  }[];
  resourcePermissions: AuthPermission[];
}

export interface AuthPermission {
  resource: string;
  permissions: string[];
}

export interface EmployeeTokenClaim {
  user: {
    sub: string;
    username: string;
    username_verified: boolean;
    language: string;
    jti: string; // JWT ID for logout functionality
  };
}
