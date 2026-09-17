import { FerroxHttpRequest, FerroxHttpResponse } from '../transports/http-adapters';
import { PasetoAuthService } from '../auth/paseto-auth.service';
export declare class RbacGuard {
    private pasetoService;
    private requiredRoles;
    constructor(pasetoService: PasetoAuthService, requiredRoles?: string[]);
    canActivate(req: FerroxHttpRequest, res: FerroxHttpResponse): boolean;
}
