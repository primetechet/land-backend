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
  password: string;
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
  userRoles: IUserRole[];
}

export interface EmployeeTokenClaim {
  user: {
    sub: string;
    username: string;
    email?: string | null;
    roles?: IUserRole[];
    username_verified: boolean;
    language: string;
  };
}
