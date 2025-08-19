import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ACTIONS } from 'src/common/constants/actions';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { RESOURCE_KEY } from '../decorators/resource.decorator';
import {
  EmployeeTokenClaim,
  IUserRole,
} from '../interfaces/employee-login.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const requiredPermissions = this.reflector.getAllAndOverride<
      {
        resource: string;
        actions: ACTIONS[];
      }[]
    >(RESOURCE_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredPermissions || !requiredPermissions.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<EmployeeTokenClaim>();
    try {
      const user = request.user;

      if (!user) return false;

      return this.checkUserPermissions(user.roles, requiredPermissions);
    } catch {
      throw new UnauthorizedException();
    }
  }

  private checkUserPermissions(
    userRoles: IUserRole[],
    requiredPermissions: RequestObject[],
  ): boolean {
    // Iterate over each user role
    for (const userRole of userRoles) {
      // Filter rolePermissionResources to find resources that match requiredPermissions
      const hasPermission = userRole?.role?.rolePermissionResources?.some(
        (rolePermissionResource) =>
          requiredPermissions.some(
            (resource) =>
              rolePermissionResource.permissionResource.name.toLowerCase() ===
              resource.resource.toLowerCase(),
          ) &&
          rolePermissionResource.rolePermissionResourceActions?.some((action) =>
            requiredPermissions.some((_required) =>
              _required.actions.some(
                (_action) =>
                  action.permissionAction.action.toLowerCase() ===
                  _action.toLowerCase(),
              ),
            ),
          ),
      );

      if (hasPermission) {
        return true;
      }
    }

    return false; // Return false if no permissions match
  }
}

interface RequestObject {
  resource: string;
  actions: ACTIONS[];
}
