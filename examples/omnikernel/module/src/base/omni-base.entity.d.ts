import { BaseEntity } from 'typeorm';
export declare abstract class OmniBaseEntity extends BaseEntity {
    /**
     * The server-owned partition key. It is never represented by the public
     * CRUD DTOs. Together with guid it is the composite primary identity, which
     * lets the same logical GUID exist in independent server-owned partitions.
     */
    scopeId: string;
    guid: string;
    /** Server-managed optimistic version for ordinary Omni updates. */
    revision: number;
    /** Present only for resources configured with the tombstone lifecycle. */
    deletedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
