import { __decorate, __metadata } from "tslib";
import { ObjectType } from '@nestjs/graphql';
import { ChildEntity, Column } from 'typeorm';
import { OmniRecordEntity } from './base/omni-record.entity.js';
import { OmniCollectionKind } from './omni-collection-kind.enum.js';
let OmniCollectionEntity = class OmniCollectionEntity extends OmniRecordEntity {
    constructor() {
        super(...arguments);
        this.kind = OmniCollectionKind.Collection;
    }
};
__decorate([
    Column({
        type: 'varchar',
        default: OmniCollectionKind.Collection,
        enum: Object.values(OmniCollectionKind),
        length: 32,
    }),
    __metadata("design:type", String)
], OmniCollectionEntity.prototype, "collectionKind", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], OmniCollectionEntity.prototype, "summary", void 0);
OmniCollectionEntity = __decorate([
    ChildEntity(OmniCollectionKind.Collection),
    ObjectType({ isAbstract: true })
], OmniCollectionEntity);
export { OmniCollectionEntity };
//# sourceMappingURL=omni-collection.entity.js.map