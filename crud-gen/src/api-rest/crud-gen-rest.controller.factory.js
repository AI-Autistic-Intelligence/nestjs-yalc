"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crudRestControllerFactory = crudRestControllerFactory;
const common_1 = require("@nestjs/common");
const crud_gen_args_rest_decorator_js_1 = require("./crud-gen-args-rest.decorator.js");
const crud_gen_rest_interceptor_js_1 = require("./crud-gen-rest.interceptor.js");
const generic_service_js_1 = require("../typeorm/generic.service.js");
const crud_gen_helpers_js_1 = require("../crud-gen.helpers.js");
const odata_query_interface_js_1 = require("./odata-query.interface.js");
const typeorm_1 = require("typeorm");
const toKebabCase = (value) => value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_+/g, '-')
    .toLowerCase();
function inferSinglePrimaryField(entityModel) {
    const primaryColumns = (0, typeorm_1.getMetadataArgsStorage)().columns.filter((column) => {
        return (typeof column.target === 'function' &&
            (column.target === entityModel ||
                entityModel.prototype instanceof column.target) &&
            column.options.primary);
    });
    return primaryColumns.length === 1
        ? primaryColumns[0].propertyName
        : undefined;
}
function crudRestControllerFactory(options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    const { entityModel, dto = entityModel, serialize = false, path = toKebabCase(entityModel.name), serviceToken = (0, generic_service_js_1.getServiceToken)(entityModel), query = { entityType: entityModel }, idField = (_a = inferSinglePrimaryField(entityModel)) !== null && _a !== void 0 ? _a : 'id', readonly: isReadonly = false, mutations, } = options;
    let CrudRestController = class CrudRestController {
        constructor(service) {
            this.service = service;
        }
        async list(rawQuery, findOptions) {
            const { options: mapped, withCount } = this.mapQuery(rawQuery, findOptions);
            return withCount
                ? this.service.getEntityListExtended(mapped, true)
                : this.service.getEntityListExtended(mapped, false);
        }
        async getById(id) {
            const entity = await this.service.getEntity({ [idField]: id }, undefined, undefined, undefined, { failOnNull: true });
            return entity;
        }
        async create(body) {
            return this.service.createEntity(body);
        }
        async update(id, body) {
            return this.service.updateEntity({ [idField]: id }, body);
        }
        async remove(id) {
            await this.service.deleteEntity({ [idField]: id });
            return { deleted: true };
        }
        mapQuery(rawQuery, legacy) {
            var _a;
            if (this.hasODataParams(rawQuery)) {
                const params = (0, odata_query_interface_js_1.parseODataQueryParams)(rawQuery);
                return {
                    options: this.mapODataToFindOptions(params),
                    withCount: (_a = params.count) !== null && _a !== void 0 ? _a : true,
                };
            }
            return { options: legacy, withCount: true };
        }
        hasODataParams(rawQuery) {
            const keys = [
                '$select',
                '$filter',
                '$orderby',
                '$top',
                '$skip',
                '$count',
                '$expand',
            ];
            return keys.some((key) => rawQuery[key] !== undefined);
        }
        mapODataToFindOptions(params) {
            var _a, _b, _c, _d;
            const findOptions = {};
            if ((_a = params.select) === null || _a === void 0 ? void 0 : _a.length) {
                findOptions.select = params.select;
            }
            if ((_b = params.orderBy) === null || _b === void 0 ? void 0 : _b.length) {
                const order = {};
                for (const { field, direction } of params.orderBy) {
                    order[field] = direction.toUpperCase();
                }
                findOptions.order = order;
            }
            if (typeof params.top === 'number') {
                findOptions.take = params.top;
            }
            if (typeof params.skip === 'number') {
                findOptions.skip = params.skip;
            }
            if ((_c = params.expand) === null || _c === void 0 ? void 0 : _c.length) {
                const allowed = (_d = options.odata) === null || _d === void 0 ? void 0 : _d.allowedExpands;
                if (allowed) {
                    const invalid = params.expand.filter((value) => !allowed.includes(value));
                    if (invalid.length) {
                        throw new common_1.BadRequestException(`Unsupported $expand value(s): ${invalid.join(', ')}`);
                    }
                }
                findOptions.relations = params.expand;
            }
            if (params.filter) {
                findOptions.extra = Object.assign(Object.assign({}, findOptions.extra), { odata: {
                        filter: params.filter,
                    } });
            }
            return findOptions;
        }
    };
    __decorate([
        (0, common_1.Get)(),
        (0, common_1.UseInterceptors)(...(serialize ? [common_1.ClassSerializerInterceptor] : []), crud_gen_rest_interceptor_js_1.CrudGenRestPaginationInterceptor, (0, crud_gen_rest_interceptor_js_1.buildCrudGenRestSimpleMapperInterceptor)(dto, true)),
        __param(0, (0, common_1.Query)()),
        __param(1, (0, crud_gen_args_rest_decorator_js_1.CGQueryArgs)(query)),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], CrudRestController.prototype, "list", null);
    __decorate([
        (0, common_1.Get)(':id'),
        (0, common_1.UseInterceptors)(...(serialize ? [common_1.ClassSerializerInterceptor] : []), (0, crud_gen_rest_interceptor_js_1.buildCrudGenRestSimpleMapperInterceptor)(dto, false)),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], CrudRestController.prototype, "getById", null);
    __decorate([
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], CrudRestController.prototype, "create", null);
    __decorate([
        __param(1, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], CrudRestController.prototype, "update", null);
    CrudRestController = __decorate([
        (0, common_1.Controller)(path),
        __param(0, (0, common_1.Inject)((0, crud_gen_helpers_js_1.getProviderToken)(serviceToken))),
        __metadata("design:paramtypes", [generic_service_js_1.GenericService])
    ], CrudRestController);
    if ((_b = options.decorators) === null || _b === void 0 ? void 0 : _b.length) {
        (0, common_1.applyDecorators)(...options.decorators)(CrudRestController);
    }
    if (!isReadonly) {
        const proto = CrudRestController.prototype;
        const createDescriptor = Object.getOwnPropertyDescriptor(proto, 'create');
        if (!createDescriptor)
            throw new ReferenceError('CrudRestController.create must have a descriptor');
        if (!((_c = mutations === null || mutations === void 0 ? void 0 : mutations.create) === null || _c === void 0 ? void 0 : _c.disabled)) {
            (0, common_1.applyDecorators)((0, common_1.Post)(), (0, common_1.UseInterceptors)(...(serialize ? [common_1.ClassSerializerInterceptor] : []), (0, crud_gen_rest_interceptor_js_1.buildCrudGenRestSimpleMapperInterceptor)(dto, false)), ...((_e = (_d = mutations === null || mutations === void 0 ? void 0 : mutations.create) === null || _d === void 0 ? void 0 : _d.decorators) !== null && _e !== void 0 ? _e : []))(proto, 'create', createDescriptor);
        }
        const updateDescriptor = Object.getOwnPropertyDescriptor(proto, 'update');
        if (!updateDescriptor)
            throw new ReferenceError('CrudRestController.update must have a descriptor');
        if (!((_f = mutations === null || mutations === void 0 ? void 0 : mutations.update) === null || _f === void 0 ? void 0 : _f.disabled)) {
            (0, common_1.applyDecorators)((0, common_1.Put)(':id'), (0, common_1.UseInterceptors)(...(serialize ? [common_1.ClassSerializerInterceptor] : []), (0, crud_gen_rest_interceptor_js_1.buildCrudGenRestSimpleMapperInterceptor)(dto, false)), ...((_h = (_g = mutations === null || mutations === void 0 ? void 0 : mutations.update) === null || _g === void 0 ? void 0 : _g.decorators) !== null && _h !== void 0 ? _h : []))(proto, 'update', updateDescriptor);
            (0, common_1.Param)('id')(proto, 'update', 0);
        }
        const removeDescriptor = Object.getOwnPropertyDescriptor(proto, 'remove');
        if (!removeDescriptor)
            throw new ReferenceError('CrudRestController.remove must have a descriptor');
        if (!((_j = mutations === null || mutations === void 0 ? void 0 : mutations.delete) === null || _j === void 0 ? void 0 : _j.disabled)) {
            (0, common_1.applyDecorators)((0, common_1.Delete)(':id'), ...((_l = (_k = mutations === null || mutations === void 0 ? void 0 : mutations.delete) === null || _k === void 0 ? void 0 : _k.decorators) !== null && _l !== void 0 ? _l : []))(proto, 'remove', removeDescriptor);
            (0, common_1.Param)('id')(proto, 'remove', 0);
        }
    }
    return CrudRestController;
}
//# sourceMappingURL=crud-gen-rest.controller.factory.js.map