var _a;
import { __decorate, __metadata, __param } from "tslib";
import _DataLoader from 'dataloader';
import { In } from 'typeorm';
import { Operators } from '@nestjs-yalc/ag-grid/ag-grid.enum';
import { NotAcceptableException, NotFoundException, Optional, Scope, } from '@nestjs/common';
import { getServiceToken, } from '@nestjs-yalc/ag-grid/generic-service.service';
import { EventAgGrid } from '@nestjs-yalc/ag-grid/event.enum';
import EventEmitter2 from 'eventemitter2';
import { getProviderToken } from "@nestjs-yalc/ag-grid/ag-grid-factory.helper";
class _DataLoaderWithCount extends _DataLoader {
    constructor(batchFn, searchKey, findOptions, options) {
        super(async (keys) => {
            const where = {
                filters: { [searchKey]: In([...keys]) },
            };
            if (findOptions.where &&
                ((findOptions.where.filters &&
                    Object.keys(findOptions.where.filters).length) ||
                    findOptions.where.childExpressions)) {
                where.childExpressions = [
                    {
                        operator: Operators.AND,
                        ...findOptions.where,
                    },
                ];
            }
            const selections = Array.isArray(findOptions.select)
                ? findOptions.select
                : [];
            if (selections.indexOf(searchKey) === -1) {
                selections.push(searchKey);
                findOptions.select = selections;
            }
            for (const field in findOptions.order) {
                if (selections.indexOf(field) === -1) {
                    selections.push(field);
                }
            }
            const findManyOptions = {
                ...findOptions,
                where,
            };
            const [entities, count] = await batchFn(findManyOptions);
            this.count = count;
            const entityMap = {};
            entities.forEach((result) => {
                if (typeof entityMap[result[searchKey]] === 'undefined') {
                    entityMap[result[searchKey]] = [result];
                }
                else {
                    entityMap[result[searchKey]].push(result);
                }
            });
            return keys.map((key) => entityMap[key] ?? []);
        }, options);
    }
    getCount() {
        return this.count;
    }
}
let GQLDataLoader = class GQLDataLoader {
    constructor(getFn, searchKey, eventEmitter, options) {
        this.eventEmitter = eventEmitter;
        this.count = 0;
        this.dataLoaders = {};
        this.batchFn = async (findManyOptions) => {
            this.eventEmitter?.emitAsync(EventAgGrid.START_TRANSACTION, findManyOptions.info?.fieldName);
            const data = await getFn(findManyOptions);
            this.eventEmitter?.emitAsync(EventAgGrid.END_TRANSACTION, findManyOptions.info?.fieldName);
            return data;
        };
        this.searchKey = searchKey;
        this.options = options;
        this.keyMap = new WeakMap();
    }
    getSearchKey() {
        return this.searchKey;
    }
    getDataloader(findOptions, searchKey) {
        let DLKey = this.keyMap.get(findOptions);
        if (!DLKey) {
            DLKey = `${JSON.stringify(findOptions.select)}|${JSON.stringify(findOptions.where ?? { filters: {} })}|${JSON.stringify(findOptions.subQueryFilters)}|${JSON.stringify(findOptions.order ?? {})}|${String(searchKey)}`;
            this.keyMap.set(findOptions, DLKey);
        }
        if (this.dataLoaders.hasOwnProperty(DLKey)) {
            return this.dataLoaders[DLKey];
        }
        const dataLoader = new _DataLoaderWithCount(this.batchFn, searchKey, findOptions, this.options);
        this.dataLoaders[DLKey] = dataLoader;
        return dataLoader;
    }
    getCount() {
        return this.count;
    }
    async loadOne(key, findOptions, throwOnNotFound = false) {
        const result = await this.loadOneToMany(key, findOptions, false);
        if (!Array.isArray(result) || result.length === 0) {
            if (throwOnNotFound)
                throw new NotFoundException(`Resource with key ${key} was not found`);
            else
                return null;
        }
        if (result.length > 1) {
            throw new NotAcceptableException(`Resource with key ${key} has more than one association`);
        }
        return result[0];
    }
    async loadOneToMany(key, findOptions, withCount = true) {
        const keyValue = Array.isArray(key) ? key[1] : key;
        const keyName = Array.isArray(key) ? key[0] : this.searchKey;
        if (keyValue === undefined || keyValue === null)
            return [];
        const dataloader = this.getDataloader(findOptions, keyName);
        if (withCount)
            return [await dataloader.load(keyValue), dataloader.getCount()];
        return dataloader.load(keyValue);
    }
};
GQLDataLoader = __decorate([
    __param(2, Optional()),
    __metadata("design:paramtypes", [Function, Object, typeof (_a = typeof EventEmitter2 !== "undefined" && EventEmitter2) === "function" ? _a : Object, Object])
], GQLDataLoader);
export { GQLDataLoader };
export const getFn = (service) => async (findManyOptions) => {
    return service.getEntityListAgGrid(findManyOptions, true);
};
export function DataLoaderFactory(defaultSearchKey, entity, serviceToken) {
    return {
        provide: getDataloaderToken(entity.name),
        useFactory: (service, eventEmitter) => {
            return new GQLDataLoader(getFn(service), defaultSearchKey, eventEmitter);
        },
        inject: [serviceToken ?? getServiceToken(entity), EventEmitter2],
        scope: Scope.REQUEST,
    };
}
export function getDataloaderToken(entity) {
    return `${getProviderToken(entity)}Dataloader`;
}
//# sourceMappingURL=dataloader.helper.js.map