import { FerroxHttpRequest, FerroxHttpResponse } from '../transports/http-adapters';
export declare class MandatoryComplianceGuard {
    canActivate(req: FerroxHttpRequest, res: FerroxHttpResponse): boolean;
}
