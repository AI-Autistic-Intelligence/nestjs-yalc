"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RbacGuard = void 0;
class RbacGuard {
    pasetoService;
    requiredRoles;
    constructor(pasetoService, requiredRoles = []) {
        this.pasetoService = pasetoService;
        this.requiredRoles = requiredRoles;
    }
    canActivate(req, res) {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'Missing or invalid Authorization header. Expected Bearer <PASETO-TOKEN>',
            });
            return false;
        }
        const token = authHeader.slice(7);
        try {
            const payload = this.pasetoService.verifyV4LocalToken(token);
            req.user = payload;
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
        }
        catch (err) {
            res.status(401).json({
                error: 'Unauthorized',
                message: `PASETO token verification failed: ${err.message}`,
            });
            return false;
        }
    }
}
exports.RbacGuard = RbacGuard;
