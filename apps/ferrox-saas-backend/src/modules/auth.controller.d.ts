export declare class AuthController {
    private pasetoService;
    private totpService;
    constructor(secretKey?: string);
    register(req: any): {
        success: boolean;
        message: string;
        email: any;
        totpSetupRequired: boolean;
    };
    login(req: any): {
        tokenType: string;
        token: string;
        expiresIn: number;
    };
    totpSetup(req: any): {
        secret: string;
        otpAuthUri: string;
    };
    totpVerify(req: any): {
        isValid: boolean;
        status: string;
    };
}
