import { UsersApiClient } from '@nest-yalc-2/skeleton-module';
export declare class UsersClientController {
    private readonly client;
    constructor(client: UsersApiClient);
    listUsers(): Promise<any>;
    listPhones(): Promise<any>;
}
