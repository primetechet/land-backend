import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class EmployeeGuard implements CanActivate {
  constructor(private readonly prisma: DatabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      const user = request.user;

      if (!user) return false;

      const employee = await this.prisma.employee.findUnique({
        where: { id: user.sub },
        select: { id: true },
      });

      if (!employee) {
        throw new UnauthorizedException('Unauthorized!');
      }
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
