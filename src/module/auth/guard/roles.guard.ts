import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '@src/common/decorator/roles.decorator';
import { AuthenticatedUser } from '@src/common/types/authenticated-user';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );
        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest<{
            user?: AuthenticatedUser;
        }>();
        const user = request.user;
        if (!user) {
            return false;
        }

        const userRoles = [
            ...(user.role ? [user.role] : []),
            ...(user.roles ?? []),
        ];

        return requiredRoles.some((role) => userRoles.includes(role));
    }
}
