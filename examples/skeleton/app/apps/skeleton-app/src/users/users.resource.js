"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersResourceProviders = exports.UsersController = exports.usersResource = void 0;
const common_1 = require("@nestjs/common");
const crud_gen_1 = require("@nestjs-yalc/crud-gen");
const crud_gen_enum_js_1 = require("@nestjs-yalc/crud-gen/crud-gen.enum.js");
const returnValue_js_1 = __importDefault(require("@nestjs-yalc/utils/returnValue.js"));
const skeleton_module_1 = require("@nestjs-yalc/skeleton-module");
const crudgen_provider_compat_js_1 = require("../crudgen-provider-compat.js");
const skeletonUserServiceToken = 'SkeletonUserGenericService';
const lowerCaseEmailMiddleware = (_ctx, input, value) => {
    if (value === true) {
        input.email = input.email.toLowerCase();
    }
};
exports.usersResource = (0, crud_gen_1.CrudGenResourceFactory)({
    entityModel: skeleton_module_1.SkeletonUser,
    backend: {
        service: {
            dbConnection: 'default',
            entityModel: skeleton_module_1.SkeletonUser,
            provider: {
                provide: skeletonUserServiceToken,
                useClass: (0, skeleton_module_1.skeletonUserServiceFactory)('default'),
            },
        },
        dataloader: { databaseKey: 'guid' },
    },
    graphql: {
        resolver: {
            dto: skeleton_module_1.SkeletonUserType,
            input: {
                create: skeleton_module_1.SkeletonUserCreateInput,
                update: skeleton_module_1.SkeletonUserUpdateInput,
                conditions: skeleton_module_1.SkeletonUserCondition,
            },
            prefix: 'SkeletonModule_',
            queries: {
                getResource: {
                    decorators: [(0, common_1.UseGuards)((0, skeleton_module_1.RoleAuth)([skeleton_module_1.RoleEnum.PUBLIC]))],
                    idName: 'guid',
                    queryParams: {
                        description: 'Get a specific user',
                    },
                },
                getResourceGrid: {
                    decorators: [(0, common_1.UseGuards)((0, skeleton_module_1.RoleAuth)([skeleton_module_1.RoleEnum.PUBLIC]))],
                    extraArgs: {
                        firstName: {
                            filterCondition: crud_gen_enum_js_1.GeneralFilters.CONTAINS,
                            filterType: crud_gen_enum_js_1.FilterType.TEXT,
                            options: {
                                type: (0, returnValue_js_1.default)(String),
                                nullable: true,
                            },
                        },
                        lastName: {
                            filterCondition: crud_gen_enum_js_1.GeneralFilters.CONTAINS,
                            filterType: crud_gen_enum_js_1.FilterType.TEXT,
                            options: {
                                type: (0, returnValue_js_1.default)(String),
                                nullable: true,
                            },
                        },
                    },
                    extraArgsStrategy: crud_gen_enum_js_1.ExtraArgsStrategy.AT_LEAST_ONE,
                    queryParams: {
                        description: 'Get a list of users',
                    },
                },
            },
            mutations: {
                createResource: {
                    decorators: [(0, common_1.UseGuards)((0, skeleton_module_1.RoleAuth)([skeleton_module_1.RoleEnum.PUBLIC]))],
                    extraInputs: {
                        lowerCaseEmail: {
                            gqlOptions: {
                                description: 'Force the email to be in lowercase',
                                type: (0, returnValue_js_1.default)(Boolean),
                                defaultValue: true,
                                nullable: true,
                            },
                            middleware: lowerCaseEmailMiddleware,
                        },
                    },
                    queryParams: {
                        description: 'Create a new user',
                    },
                },
                updateResource: {
                    decorators: [(0, common_1.UseGuards)((0, skeleton_module_1.RoleAuth)([skeleton_module_1.RoleEnum.PUBLIC]))],
                    queryParams: {
                        description: 'Update an existing user',
                    },
                },
                deleteResource: {
                    decorators: [(0, common_1.UseGuards)((0, skeleton_module_1.RoleAuth)([skeleton_module_1.RoleEnum.PUBLIC]))],
                    queryParams: {
                        description: 'Delete an existing user',
                    },
                },
            },
        },
    },
    rest: {
        dto: skeleton_module_1.SkeletonUserType,
        path: 'users',
        idField: 'guid',
        serviceToken: skeletonUserServiceToken,
        mutations: {
            create: { decorators: [] },
            update: { decorators: [] },
        },
    },
});
exports.UsersController = exports.usersResource.controllers[0];
exports.usersResourceProviders = (0, crudgen_provider_compat_js_1.bindGeneratedDataloaderEventEmitter)(exports.usersResource.providers);
//# sourceMappingURL=users.resource.js.map