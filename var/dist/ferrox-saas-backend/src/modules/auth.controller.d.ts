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
        token: any;
        expiresIn: number;
    };
    totpSetup(req: any): {
        secret: any;
        otpAuthUri: any;
    };
    totpVerify(req: any): {
        isValid: any;
        status: string;
    };
}
