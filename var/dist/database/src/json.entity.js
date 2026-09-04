import { __decorate, __metadata } from "tslib";
import { BeforeUpdate, Entity } from 'typeorm';
import { NYALC_JSON_FIELD_META_KEY } from './json.helpers';
export const JsonEntityMixin = (base) => {
    let JsonEntityMixin = class JsonEntityMixin extends base {
        updateData() {
            const metadata = Reflect.getMetadata(NYALC_JSON_FIELD_META_KEY, this.constructor.prototype);
            Object.entries(metadata).map(([k, v]) => {
                if (v !== true || !this[k])
                    return;
                const newData = JSON.stringify(this[k]).replace(/'/g, "\\'");
                this[k] = () => `JSON_MERGE_PATCH(${k}, '${newData}')`;
            });
        }
    };
    __decorate([
        BeforeUpdate(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], JsonEntityMixin.prototype, "updateData", null);
    JsonEntityMixin = __decorate([
        Entity()
    ], JsonEntityMixin);
    return JsonEntityMixin;
};
//# sourceMappingURL=json.entity.js.map