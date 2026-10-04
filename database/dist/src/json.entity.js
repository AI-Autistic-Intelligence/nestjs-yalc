"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonEntityMixin = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const json_helpers_1 = require("./json.helpers");
const JsonEntityMixin = (base) => {
    let JsonEntityMixin = class JsonEntityMixin extends base {
        updateData() {
            const metadata = Reflect.getMetadata(json_helpers_1.NYALC_JSON_FIELD_META_KEY, this.constructor.prototype);
            Object.entries(metadata).map(([k, v]) => {
                if (v !== true || !this[k])
                    return;
                const newData = JSON.stringify(this[k]).replace(/'/g, "\\'");
                this[k] = () => `JSON_MERGE_PATCH(${k}, '${newData}')`;
            });
        }
    };
    tslib_1.__decorate([
        (0, typeorm_1.BeforeUpdate)(),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", []),
        tslib_1.__metadata("design:returntype", void 0)
    ], JsonEntityMixin.prototype, "updateData", null);
    JsonEntityMixin = tslib_1.__decorate([
        (0, typeorm_1.Entity)()
    ], JsonEntityMixin);
    return JsonEntityMixin;
};
exports.JsonEntityMixin = JsonEntityMixin;
//# sourceMappingURL=json.entity.js.map