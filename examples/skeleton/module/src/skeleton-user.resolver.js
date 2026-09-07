"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.skeletonUserProvidersFactory = exports.SkeletonUserResolver = exports.lowerCaseEmailMiddleware = void 0;
const crud_gen_helpers_js_1 = require("@nest-yalc-2/crud-gen/crud-gen.helpers.js");
const generic_resolver_js_1 = require("@nest-yalc-2/crud-gen/api-graphql/generic.resolver.js");
const dataloader_helper_js_1 = require("@nest-yalc-2/data-loader/dataloader.helper.js");
const returnValue_js_1 = __importDefault(require("@nest-yalc-2/utils/returnValue.js"));
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const graphql_1 = require("@nestjs/graphql");
const skeleton_user_dto_js_1 = require("./skeleton-user.dto.js");
const skeleton_user_entity_js_1 = require("./skeleton-user.entity.js");
const role_guard_js_1 = require("./role.guard.js");
const skeletonUserServiceJs = __importStar(require("./skeleton-user.service.js"));
const gqlmapper_decorator_js_1 = require("@nest-yalc-2/crud-gen/api-graphql/gqlmapper.decorator.js");
const crud_gen_enum_js_1 = require("@nest-yalc-2/crud-gen/crud-gen.enum.js");
const lowerCaseEmailMiddleware = (_ctx, input, value) => {
    if (value === true) {
        input.email = input.email.toLowerCase();
    }
};
exports.lowerCaseEmailMiddleware = lowerCaseEmailMiddleware;
let SkeletonUserResolver = class SkeletonUserResolver extends (0, generic_resolver_js_1.resolverFactory)({
    entityModel: skeleton_user_entity_js_1.SkeletonUser,
    dto: skeleton_user_dto_js_1.SkeletonUserType,
    input: {
        create: skeleton_user_dto_js_1.SkeletonUserCreateInput,
        update: skeleton_user_dto_js_1.SkeletonUserUpdateInput,
        conditions: skeleton_user_dto_js_1.SkeletonUserCondition,
    },
    prefix: 'SkeletonModule_',
    queries: {
        getResource: {
            decorators: [(0, common_1.UseGuards)((0, role_guard_js_1.RoleAuth)([role_guard_js_1.RoleEnum.PUBLIC]))],
            idName: 'guid',
            queryParams: {
                description: 'Get a specific user',
            },
        },
        getResourceGrid: {
            decorators: [(0, common_1.UseGuards)((0, role_guard_js_1.RoleAuth)([role_guard_js_1.RoleEnum.PUBLIC]))],
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
            decorators: [(0, common_1.UseGuards)((0, role_guard_js_1.RoleAuth)([role_guard_js_1.RoleEnum.PUBLIC]))],
            extraInputs: {
                lowerCaseEmail: {
                    gqlOptions: {
                        description: 'Force the email to be in lowercase',
                        type: (0, returnValue_js_1.default)(Boolean),
                        defaultValue: true,
                        nullable: true,
                    },
                    middleware: exports.lowerCaseEmailMiddleware,
                },
            },
            queryParams: {
                description: 'Create a new user',
            },
        },
        updateResource: {
            decorators: [(0, common_1.UseGuards)((0, role_guard_js_1.RoleAuth)([role_guard_js_1.RoleEnum.PUBLIC]))],
            queryParams: {
                description: 'Update an existing user',
            },
        },
        deleteResource: {
            decorators: [(0, common_1.UseGuards)((0, role_guard_js_1.RoleAuth)([role_guard_js_1.RoleEnum.PUBLIC]))],
            queryParams: {
                description: 'Delete an existing user',
            },
        },
    },
}) {
    constructor(service, dataloader, moduleRef) {
        super(service, dataloader, moduleRef);
        this.service = service;
        this.dataloader = dataloader;
        this.moduleRef = moduleRef;
    }
    async SkeletonModule_generateRandomPassword(ID) {
        return this.service.resetPassword(ID);
    }
    fullName(parent) {
        var _a;
        return ((_a = parent.fullName) !== null && _a !== void 0 ? _a : [parent.firstName, parent.lastName].filter(Boolean).join(' '));
    }
};
exports.SkeletonUserResolver = SkeletonUserResolver;
__decorate([
    (0, common_1.UseGuards)((0, role_guard_js_1.RoleAuth)([role_guard_js_1.RoleEnum.PUBLIC])),
    (0, graphql_1.Mutation)((0, returnValue_js_1.default)(String), {
        description: 'Reset user password with a random one and send the new value back.',
    }),
    __param(0, (0, gqlmapper_decorator_js_1.InputArgs)({
        _name: 'ID',
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SkeletonUserResolver.prototype, "SkeletonModule_generateRandomPassword", null);
__decorate([
    (0, graphql_1.ResolveField)((0, returnValue_js_1.default)(String), {
        description: "It's the combination of firstName and lastName",
    }),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [skeleton_user_dto_js_1.SkeletonUserType]),
    __metadata("design:returntype", String)
], SkeletonUserResolver.prototype, "fullName", null);
exports.SkeletonUserResolver = SkeletonUserResolver = __decorate([
    (0, graphql_1.Resolver)((0, returnValue_js_1.default)(skeleton_user_dto_js_1.SkeletonUserType)),
    __metadata("design:paramtypes", [Object, dataloader_helper_js_1.GQLDataLoader,
        core_1.ModuleRef])
], SkeletonUserResolver);
const skeletonUserProvidersFactory = (dbConnection) => (0, crud_gen_helpers_js_1.CrudGenDependencyFactory)({
    entityModel: skeleton_user_entity_js_1.SkeletonUser,
    resolver: {
        provider: SkeletonUserResolver,
    },
    service: {
        dbConnection: dbConnection,
        entityModel: skeleton_user_entity_js_1.SkeletonUser,
        provider: {
            provide: 'SkeletonUserGenericService',
            useClass: skeletonUserServiceJs.skeletonUserServiceFactory(dbConnection),
        },
    },
    dataloader: { databaseKey: 'guid' },
});
exports.skeletonUserProvidersFactory = skeletonUserProvidersFactory;
//# sourceMappingURL=skeleton-user.resolver.js.map