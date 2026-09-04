import type { IHttpCallStrategy } from '@nestjs-yalc/api-strategy';
import type { SkeletonPhoneCreateInput, SkeletonPhoneType } from '../skeleton-phone.dto.js';
import type { SkeletonUserCreateInput, SkeletonUserType } from '../skeleton-user.dto.js';
export declare const USERS_CLIENT_API_STRATEGY = "USERS_CLIENT_API_STRATEGY";
export declare const USERS_CLIENT_LOCAL_API_STRATEGY = "USERS_CLIENT_LOCAL_API_STRATEGY";
export declare const USERS_CLIENT_HTTP_API_STRATEGY = "USERS_CLIENT_HTTP_API_STRATEGY";
export interface UsersClientPageData {
    startRow: number;
    count: number;
    [key: string]: unknown;
}
export interface UsersClientListResponse<TItem> {
    list: TItem[];
    pageData: UsersClientPageData;
}
export declare class UsersApiClient {
    private readonly api;
    constructor(api: IHttpCallStrategy);
    listUsers(): Promise<UsersClientListResponse<SkeletonUserType>>;
    createUser(payload: SkeletonUserCreateInput): Promise<SkeletonUserType>;
    listPhones(): Promise<UsersClientListResponse<SkeletonPhoneType>>;
    createPhone(payload: SkeletonPhoneCreateInput): Promise<SkeletonPhoneType>;
}
