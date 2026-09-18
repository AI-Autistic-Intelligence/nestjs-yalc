export declare class UsersController {
    getProfile(): {
        id: string;
        email: string;
        roles: string[];
        securityTier: string;
        twoFactorEnabled: boolean;
    };
}
