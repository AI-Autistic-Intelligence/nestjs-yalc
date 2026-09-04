import { BaseEntity } from 'typeorm';
export class ExtendedBaseEntity extends BaseEntity {
    constructor() {
        super(...arguments);
        this.first = 1;
        this.second = 'second';
        this.third = "{test: 'testtest'}";
    }
}
//# sourceMappingURL=extended-base-entity.entity.js.map