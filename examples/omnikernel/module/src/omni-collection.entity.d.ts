import { OmniRecordEntity } from './base/omni-record.entity.js';
import { OmniCollectionKind } from './omni-collection-kind.enum.js';
export declare class OmniCollectionEntity extends OmniRecordEntity {
    kind: OmniCollectionKind;
    collectionKind: OmniCollectionKind;
    summary?: string | null;
}
