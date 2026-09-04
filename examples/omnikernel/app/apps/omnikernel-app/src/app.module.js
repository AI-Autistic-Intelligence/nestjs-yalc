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
const event_emitter_1 = require("@nestjs/event-emitter");
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("@nestjs/typeorm");
const uuid_scalar_1 = require("@nestjs-yalc/graphql/scalars/uuid.scalar");
const omnikernel_module_1 = require("@nestjs-yalc/omnikernel-module");
const omni_api_module_1 = require("./omni/omni-api.module");
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
            event_emitter_1.EventEmitterModule.forRoot(),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'sqlite',
                database: ':memory:',
                dropSchema: true,
                entities: [
                    omnikernel_module_1.OmniNamedEntity,
                    omnikernel_module_1.OmniRecordEntity,
                    omnikernel_module_1.OmniRelationEntity,
                    omnikernel_module_1.OmniCollectionEntity,
                    omnikernel_module_1.OmniDocumentEntity,
                    omnikernel_module_1.OmniExternalRefEntity,
                ],
                synchronize: true,
            }),
            omni_api_module_1.OmniApiModule.register('default'),
        ],
        providers: [uuid_scalar_1.UUIDScalar],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map