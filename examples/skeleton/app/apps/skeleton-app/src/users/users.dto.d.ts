export declare class CreateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}
export declare class UpdateUserDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
}
export declare class UserMetaDto {
    lastLoginAt?: Date | string;
}
