"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const apollo_1 = require("@nestjs/apollo");
const typeorm_1 = require("@nestjs/typeorm");
const test_entity_1 = require("./test.entity");
const test_resolver_1 = require("./test.resolver");
const user_entity_1 = require("./entities/user.entity");
const post_entity_1 = require("./entities/post.entity");
const user_module_1 = require("./modules/user/user.module");
const gql_complexity_plugin_1 = require("@nest-yalc-2/graphql/plugins/gql-complexity.plugin");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'sqlite',
                database: ':memory:',
                entities: [test_entity_1.TestEntity, user_entity_1.UserEntity, post_entity_1.PostEntity],
                synchronize: true,
                logging: false,
            }),
            graphql_1.GraphQLModule.forRoot({
                driver: apollo_1.ApolloDriver,
                autoSchemaFile: 'dummy-schema.gql',
                playground: false,
                buildSchemaOptions: {
                    fieldMiddleware: [],
                },
            }),
            user_module_1.UserModule,
        ],
        providers: [test_resolver_1.TestResolver, gql_complexity_plugin_1.GqlComplexityPlugin],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map