import { FerroxHttpRequest, FerroxHttpResponse } from '../transports/http-adapters';
import { PasetoAuthService, PasetoPayload } from '../auth/paseto-auth.service';

export class RbacGuard {
  private pasetoService: PasetoAuthService;
  private requiredRoles: string[];

  constructor(pasetoService: PasetoAuthService, requiredRoles: string[] = []) {
    this.pasetoService = pasetoService;
    this.requiredRoles = requiredRoles;
  }

  public canActivate(req: FerroxHttpRequest, res: FerroxHttpResponse): boolean {
    const authHeader = req.headers['authorization'] as string | undefined;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid Authorization header. Expected Bearer <PASETO-TOKEN>',
      });
      return false;
    }

    const token = authHeader.slice(7);
    try {
      const payload: PasetoPayload = this.pasetoService.verifyV4LocalToken(token);
      (req as any).user = payload;

      if (this.requiredRoles.length > 0) {
        const userRoles = payload.roles || [];
        const hasRole = this.requiredRoles.some((role) => userRoles.includes(role));
        if (!hasRole) {
          res.status(403).json({
            error: 'Forbidden',
            message: `Insufficient permissions. Required one of: ${this.requiredRoles.join(', ')}`,
          });
          return false;
        }
      }

      return true;
    } catch (err: any) {
      res.status(401).json({
        error: 'Unauthorized',
        message: `PASETO token verification failed: ${err.message}`,
      });
      return false;
    }
  }
}
