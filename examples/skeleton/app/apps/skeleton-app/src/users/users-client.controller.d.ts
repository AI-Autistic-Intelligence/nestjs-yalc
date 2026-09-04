import { UsersApiClient } from '@nestjs-yalc/skeleton-module';
export declare class UsersClientController {
    private readonly client;
    constructor(client: UsersApiClient);
    listUsers(): Promise<any>;
    listPhones(): Promise<any>;
}
