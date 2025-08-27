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

export interface ILogin {
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

export interface TokenClaim {
  user: {
    sub: string;
    username: string;
    username_verified: boolean;
    language: string;
  };
}
