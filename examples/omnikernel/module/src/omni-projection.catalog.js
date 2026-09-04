"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OMNI_PROJECTION_READER_CATALOG = void 0;
exports.createOmniProjectionReaderCatalog = createOmniProjectionReaderCatalog;
exports.createOmniProjectionReaderCatalogProvider = createOmniProjectionReaderCatalogProvider;
const crud_gen_1 = require("@nestjs-yalc/crud-gen");
const typeorm_1 = require("typeorm");
const omni_record_entity_js_1 = require("./base/omni-record.entity.js");
const omni_relation_entity_js_1 = require("./base/omni-relation.entity.js");
const omni_relation_projection_definition_js_1 = require("./omni-relation-projection.definition.js");
const omni_relation_status_enum_js_1 = require("./omni-relation-status.enum.js");
exports.OMNI_PROJECTION_READER_CATALOG = Symbol('OMNI_PROJECTION_READER_CATALOG');
function freeze(value) {
    if (value && typeof value === 'object')
        Object.freeze(value);
    return value;
}
function validateReaderTake(take) {
    if (take === undefined)
        return undefined;
    if (!Number.isInteger(take) || take < 1 || take > 1000) {
        throw new TypeError('Omni projection reader take must be an integer from 1 to 1000.');
    }
    return take;
}
function relationWhere(definition) {
    var _a;
    const relation = definition.relation;
    return Object.assign({ kind: (0, typeorm_1.In)([...(0, omni_relation_projection_definition_js_1.getOmniRelationProjectionAllowedKinds)(definition)]), status: (_a = relation.status) !== null && _a !== void 0 ? _a : omni_relation_status_enum_js_1.OmniRelationStatus.Active }, (relation.schema
        ? {
            payloadSchemaId: relation.schema.id,
            payloadSchemaVersion: relation.schema.version,
        }
        : {
            payloadSchemaId: (0, typeorm_1.IsNull)(),
            payloadSchemaVersion: (0, typeorm_1.IsNull)(),
        }));
}
function extensionReader(manager, scope, registration) {
    const ownerWhere = {
        scopeId: scope.scopeId,
        kind: registration.definition.owner.kind,
        payloadSchemaId: registration.definition.owner.schema.id,
        payloadSchemaVersion: registration.definition.owner.schema.version,
        deletedAt: (0, typeorm_1.IsNull)(),
    };
    const extensionRepository = manager.getRepository(registration.entity);
    const ownerRepository = manager.getRepository(omni_record_entity_js_1.OmniRecordEntity);
    const identity = registration.definition.identity.column;
    const scopeColumn = registration.definition.scope.column;
    const project = (entity, owner) => {
        const projected = Object.assign(Object.assign({}, entity), { scopeId: owner.scopeId, guid: owner.guid, [registration.definition.revision.column]: owner.revision, createdAt: owner.createdAt, updatedAt: owner.updatedAt, deletedAt: owner.deletedAt });
        return projected;
    };
    const getOwner = async (guid) => {
        const owner = await ownerRepository.findOne({
            where: Object.assign(Object.assign({}, ownerWhere), { guid }),
        });
        return owner !== null && owner !== void 0 ? owner : undefined;
    };
    const dialect = (() => {
        const type = manager.connection.options.type;
        if (type !== 'sqlite' && type !== 'postgres') {
            throw new TypeError('Omni projection readers require SQLite or PostgreSQL.');
        }
        return (0, crud_gen_1.createProjectionDialect)(type);
    })();
    const filtersFor = (where) => {
        var _a, _b;
        const filters = [];
        for (const [fieldName, value] of Object.entries(where !== null && where !== void 0 ? where : {})) {
            const field = registration.definition.fields.find((candidate) => candidate.name === fieldName);
            if (!field || !((_b = (_a = field.query) === null || _a === void 0 ? void 0 : _a.filter) === null || _b === void 0 ? void 0 : _b.includes('eq'))) {
                throw new TypeError(`Omni extension reader only permits declared eq fields: ${fieldName}.`);
            }
            filters.push({ field, operator: 'eq', values: [value] });
        }
        return filters;
    };
    const projectMany = async (entities) => {
        if (entities.length === 0)
            return [];
        const candidates = entities.map((entity) => entity[identity]);
        const guids = candidates.filter((guid) => typeof guid === 'string');
        const owners = await ownerRepository.find({
            where: Object.assign(Object.assign({}, ownerWhere), { guid: (0, typeorm_1.In)(guids) }),
        });
        const ownersByGuid = new Map(owners.map((owner) => [owner.guid, owner]));
        return entities.flatMap((entity) => {
            const guid = entity[identity];
            const owner = typeof guid === 'string' ? ownersByGuid.get(guid) : undefined;
            return owner ? [project(entity, owner)] : [];
        });
    };
    return freeze({
        async get(guid) {
            const entity = await extensionRepository.findOne({
                where: { [scopeColumn]: scope.scopeId, [identity]: guid },
            });
            if (!entity)
                return undefined;
            const owner = await getOwner(guid);
            return owner ? project(entity, owner) : undefined;
        },
        async list(options = {}) {
            const [entities] = await dialect.findMany(extensionRepository, registration.definition, scope.scopeId, filtersFor(options.where), [], { take: validateReaderTake(options.take) });
            return projectMany(entities);
        },
    });
}
function relationReader(manager, scope, registration) {
    const repository = manager.getRepository(omni_relation_entity_js_1.OmniRelationEntity);
    const fixed = relationWhere(registration.definition);
    return freeze({
        async get(guid) {
            const entity = await repository.findOne({
                where: Object.assign({ scopeId: scope.scopeId, guid }, fixed),
            });
            return entity !== null && entity !== void 0 ? entity : undefined;
        },
        async list(options = {}) {
            const { take } = options, conditions = __rest(options, ["take"]);
            return await repository.find({
                where: Object.assign(Object.assign({ scopeId: scope.scopeId }, fixed), conditions),
                take: validateReaderTake(take),
            });
        },
    });
}
function createOmniProjectionReaderCatalog(registrations) {
    const byId = new Map();
    for (const source of registrations) {
        const registration = 'reader' in source ? source.reader : source;
        if (!registration.id || byId.has(registration.id)) {
            throw new TypeError('Omni projection reader registrations must have unique non-empty ids.');
        }
        byId.set(registration.id, registration);
    }
    const snapshot = freeze(new Map(byId));
    return freeze({
        bind(manager, scope) {
            return freeze({
                extension(id) {
                    const registration = snapshot.get(id);
                    if (!registration || registration.type !== 'extension') {
                        throw new TypeError(`Omni extension projection reader is not registered: ${id}.`);
                    }
                    return extensionReader(manager, scope, registration);
                },
                relation(id) {
                    const registration = snapshot.get(id);
                    if (!registration || registration.type !== 'relation') {
                        throw new TypeError(`Omni relation projection reader is not registered: ${id}.`);
                    }
                    return relationReader(manager, scope, registration);
                },
            });
        },
    });
}
function createOmniProjectionReaderCatalogProvider(registrations, token = exports.OMNI_PROJECTION_READER_CATALOG) {
    return {
        provide: token,
        useValue: createOmniProjectionReaderCatalog(registrations),
    };
}
//# sourceMappingURL=omni-projection.catalog.js.map