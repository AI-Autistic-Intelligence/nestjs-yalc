"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhonesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const skeleton_module_1 = require("@nestjs-yalc/skeleton-module");
const phones_resource_1 = require("./phones.resource");
let PhonesModule = class PhonesModule {
};
exports.PhonesModule = PhonesModule;
exports.PhonesModule = PhonesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([skeleton_module_1.SkeletonPhone], 'default')],
        controllers: [phones_resource_1.PhonesController],
        providers: phones_resource_1.phonesResourceProviders,
        exports: [typeorm_1.TypeOrmModule],
    })
], PhonesModule);
//# sourceMappingURL=phones.module.js.map