import { __decorate, __metadata, __param } from "tslib";
import { Controller, Get, Inject, Param, applyDecorators, UseInterceptors, Post, Put, Delete, Body, Query, BadRequestException, ClassSerializerInterceptor, } from '@nestjs/common';
import { CGQueryArgs } from './crud-gen-args-rest.decorator.js';
import { buildCrudGenRestSimpleMapperInterceptor, CrudGenRestPaginationInterceptor, } from './crud-gen-rest.interceptor.js';
import { GenericService, getServiceToken } from '../typeorm/generic.service.js';
import { getProviderToken } from '../crud-gen.helpers.js';
import { parseODataQueryParams, } from './odata-query.interface.js';
import { getMetadataArgsStorage } from 'typeorm';
const toKebabCase = (value) => value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_+/g, '-')
    .toLowerCase();
function inferSinglePrimaryField(entityModel) {
    const primaryColumns = getMetadataArgsStorage().columns.filter((column) => {
        return (typeof column.target === 'function' &&
            (column.target === entityModel ||
                entityModel.prototype instanceof column.target) &&
            column.options.primary);
    });
    return primaryColumns.length === 1
        ? primaryColumns[0].propertyName
        : undefined;
}
export function crudRestControllerFactory(options) {
    const { entityModel, dto = entityModel, serialize = false, path = toKebabCase(entityModel.name), serviceToken = getServiceToken(entityModel), query = { entityType: entityModel }, idField = inferSinglePrimaryField(entityModel) ??
        'id', readonly: isReadonly = false, mutations, } = options;
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
            if (this.hasODataParams(rawQuery)) {
                const params = parseODataQueryParams(rawQuery);
                return {
                    options: this.mapODataToFindOptions(params),
                    withCount: params.count ?? true,
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
            const findOptions = {};
            if (params.select?.length) {
                findOptions.select = params.select;
            }
            if (params.orderBy?.length) {
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
            if (params.expand?.length) {
                const allowed = options.odata?.allowedExpands;
                if (allowed) {
                    const invalid = params.expand.filter((value) => !allowed.includes(value));
                    if (invalid.length) {
                        throw new BadRequestException(`Unsupported $expand value(s): ${invalid.join(', ')}`);
                    }
                }
                findOptions.relations = params.expand;
            }
            if (params.filter) {
                findOptions.extra = {
                    ...findOptions.extra,
                    odata: {
                        filter: params.filter,
                    },
                };
            }
            return findOptions;
        }
    };
    __decorate([
        Get(),
        UseInterceptors(...(serialize ? [ClassSerializerInterceptor] : []), CrudGenRestPaginationInterceptor, buildCrudGenRestSimpleMapperInterceptor(dto, true)),
        __param(0, Query()),
        __param(1, CGQueryArgs(query)),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], CrudRestController.prototype, "list", null);
    __decorate([
        Get(':id'),
        UseInterceptors(...(serialize ? [ClassSerializerInterceptor] : []), buildCrudGenRestSimpleMapperInterceptor(dto, false)),
        __param(0, Param('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], CrudRestController.prototype, "getById", null);
    __decorate([
        __param(0, Body()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], CrudRestController.prototype, "create", null);
    __decorate([
        __param(1, Body()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], CrudRestController.prototype, "update", null);
    CrudRestController = __decorate([
        Controller(path),
        __param(0, Inject(getProviderToken(serviceToken))),
        __metadata("design:paramtypes", [GenericService])
    ], CrudRestController);
    if (options.decorators?.length) {
        applyDecorators(...options.decorators)(CrudRestController);
    }
    if (!isReadonly) {
        const proto = CrudRestController.prototype;
        const createDescriptor = Object.getOwnPropertyDescriptor(proto, 'create');
        if (!createDescriptor)
            throw new ReferenceError('CrudRestController.create must have a descriptor');
        if (!mutations?.create?.disabled) {
            applyDecorators(Post(), UseInterceptors(...(serialize ? [ClassSerializerInterceptor] : []), buildCrudGenRestSimpleMapperInterceptor(dto, false)), ...(mutations?.create?.decorators ?? []))(proto, 'create', createDescriptor);
        }
        const updateDescriptor = Object.getOwnPropertyDescriptor(proto, 'update');
        if (!updateDescriptor)
            throw new ReferenceError('CrudRestController.update must have a descriptor');
        if (!mutations?.update?.disabled) {
            applyDecorators(Put(':id'), UseInterceptors(...(serialize ? [ClassSerializerInterceptor] : []), buildCrudGenRestSimpleMapperInterceptor(dto, false)), ...(mutations?.update?.decorators ?? []))(proto, 'update', updateDescriptor);
            Param('id')(proto, 'update', 0);
        }
        const removeDescriptor = Object.getOwnPropertyDescriptor(proto, 'remove');
        if (!removeDescriptor)
            throw new ReferenceError('CrudRestController.remove must have a descriptor');
        if (!mutations?.delete?.disabled) {
            applyDecorators(Delete(':id'), ...(mutations?.delete?.decorators ?? []))(proto, 'remove', removeDescriptor);
            Param('id')(proto, 'remove', 0);
        }
    }
    return CrudRestController;
}
//# sourceMappingURL=crud-gen-rest.controller.factory.js.map