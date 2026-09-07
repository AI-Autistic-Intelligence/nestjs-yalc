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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFn = exports.GQLDataLoader = void 0;
exports.DataLoaderFactory = DataLoaderFactory;
exports.getDataloaderToken = getDataloaderToken;
const dataloader_1 = __importDefault(require("dataloader"));
const typeorm_1 = require("typeorm");
const crud_gen_enum_js_1 = require("@nest-yalc-2/crud-gen/crud-gen.enum.js");
const common_1 = require("@nestjs/common");
const generic_service_js_1 = require("@nest-yalc-2/crud-gen/typeorm/generic.service.js");
const crud_gen_helpers_js_1 = require("@nest-yalc-2/crud-gen/crud-gen.helpers.js");
const event_enum_js_1 = require("@nest-yalc-2/crud-gen/event.enum.js");
const eventemitter2_1 = __importDefault(require("eventemitter2"));
class _DataLoaderWithCount extends dataloader_1.default {
    constructor(batchFn, searchKey, findOptions, options) {
        super(async (keys) => {
            const where = {
                filters: { [searchKey]: (0, typeorm_1.In)([...keys]) },
            };
            if (findOptions.where &&
                ((findOptions.where.filters &&
                    Object.keys(findOptions.where.filters).length) ||
                    findOptions.where.childExpressions)) {
                where.childExpressions = [
                    {
                        operator: crud_gen_enum_js_1.Operators.AND,
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
            const randomId = Math.random();
            void this.eventEmitter?.emitAsync(event_enum_js_1.EventCrudGen.START_TRANSACTION, findManyOptions.info?.fieldName, randomId);
            const data = await getFn(findManyOptions);
            void this.eventEmitter?.emitAsync(event_enum_js_1.EventCrudGen.END_TRANSACTION, findManyOptions.info?.fieldName, randomId);
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
            const sort = typeof findOptions.select?.sort === 'function'
                ? findOptions.select.sort().join(',')
                : '';
            DLKey = `${sort}|${JSON.stringify(findOptions.where ?? { filters: {} })}|${JSON.stringify(findOptions.subQueryFilters)}|${JSON.stringify(findOptions.order ?? {})}|${JSON.stringify(findOptions.take ?? {})}|${JSON.stringify(findOptions.skip ?? {})}|${searchKey.toString()}`;
            this.keyMap.set(findOptions, DLKey);
        }
        if (Object.prototype.hasOwnProperty.call(this.dataLoaders, DLKey)) {
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
                throw new common_1.NotFoundException(`Resource with key ${key} was not found`);
            else
                return null;
        }
        if (result.length > 1) {
            throw new common_1.NotAcceptableException(`Resource with key ${key} has more than one association`);
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
exports.GQLDataLoader = GQLDataLoader;
exports.GQLDataLoader = GQLDataLoader = __decorate([
    __param(2, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [Function, Object, Function, Object])
], GQLDataLoader);
const getFn = (service) => async (findManyOptions) => {
    return service.getEntityListExtended(findManyOptions, true);
};
exports.getFn = getFn;
function DataLoaderFactory(defaultSearchKey, entity, serviceToken) {
    return {
        provide: getDataloaderToken(entity.name),
        useFactory: (service, eventEmitter) => {
            return new GQLDataLoader((0, exports.getFn)(service), defaultSearchKey, eventEmitter);
        },
        inject: [
            serviceToken ?? (0, generic_service_js_1.getServiceToken)(entity),
            eventemitter2_1.default,
        ],
        scope: common_1.Scope.REQUEST,
    };
}
function getDataloaderToken(entity) {
    return `${(0, crud_gen_helpers_js_1.getProviderToken)(entity)}Dataloader`;
}
//# sourceMappingURL=dataloader.helper.js.map