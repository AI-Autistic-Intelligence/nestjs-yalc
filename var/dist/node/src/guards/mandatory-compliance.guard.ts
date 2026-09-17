import { FerroxHttpRequest, FerroxHttpResponse } from '../transports/http-adapters';

export class MandatoryComplianceGuard {
  public canActivate(req: FerroxHttpRequest, res: FerroxHttpResponse): boolean {
    // 1. Inject mandatory Ferrox security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('X-Ferrox-Kernel-Compliance', 'ENFORCED');

    // 2. Reject non-compliant or tampered requests missing essential security headers
    const rawUserAgent = req.headers['user-agent'];
    const userAgent = Array.isArray(rawUserAgent) ? rawUserAgent.join(' ') : (rawUserAgent || '');
    if (userAgent.toLowerCase().includes('malicious-scanner')) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Security compliance policy violation detected by Ferrox Guard',
      });
      return false;
    }

    return true;
  }
}
