"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const apollo_1 = require("@nestjs/apollo");
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("@nestjs/typeorm");
const skeleton_phone_entity_1 = require("@nest-yalc-2/skeleton-module/src/skeleton-phone.entity");
const skeleton_user_entity_1 = require("@nest-yalc-2/skeleton-module/src/skeleton-user.entity");
const uuid_scalar_1 = require("@nest-yalc-2/graphql/scalars/uuid.scalar");
const phones_module_1 = require("./phones/phones.module");
const users_module_1 = require("./users/users.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            graphql_1.GraphQLModule.forRoot({
                driver: apollo_1.ApolloDriver,
                autoSchemaFile: true,
                path: '/graphql',
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'sqlite',
                database: ':memory:',
                dropSchema: true,
                entities: [skeleton_user_entity_1.SkeletonUser, skeleton_phone_entity_1.SkeletonPhone],
                synchronize: true,
            }),
            users_module_1.UsersModule,
            phones_module_1.PhonesModule,
        ],
        providers: [uuid_scalar_1.UUIDScalar],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map