import { BaseEntity } from 'typeorm';
export declare abstract class OmniBaseEntity extends BaseEntity {
    scopeId: string;
    guid: string;
    revision: number;
    deletedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
