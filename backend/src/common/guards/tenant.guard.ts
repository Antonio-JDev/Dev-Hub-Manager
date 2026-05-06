import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

/**
 * TenantGuard
 *
 * Lê o `X-Organization-Id` do header (ou outro mecanismo futuro)
 * e injeta `request.organizationId` para que os services filtrem por tenant.
 */
@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const orgId =
      request.headers['x-organization-id'] ||
      request.headers['x-organization'] ||
      request.organizationId;

    if (!orgId) {
      throw new UnauthorizedException('Organization context is required');
    }

    request.organizationId = orgId;
    return true;
  }
}
