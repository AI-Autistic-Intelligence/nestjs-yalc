"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniExtensionProjectionService = void 0;
const crud_gen_1 = require("@nestjs-yalc/crud-gen");
const typeorm_1 = require("typeorm");
const omni_record_entity_js_1 = require("./base/omni-record.entity.js");
const omni_projection_catalog_js_1 = require("./omni-projection.catalog.js");
function hasOwn(input, field) {
    return Object.prototype.hasOwnProperty.call(input, field);
}
function isUniqueConstraint(error) {
    var _a;
    const candidate = error;
    const code = (_a = candidate === null || candidate === void 0 ? void 0 : candidate.driverError) === null || _a === void 0 ? void 0 : _a.code;
    return code === 'SQLITE_CONSTRAINT' || code === '23505';
}
function isRetryableTransactionError(error) {
    var _a, _b;
    const candidate = error;
    const code = (_b = (_a = candidate === null || candidate === void 0 ? void 0 : candidate.driverError) === null || _a === void 0 ? void 0 : _a.code) !== null && _b !== void 0 ? _b : candidate === null || candidate === void 0 ? void 0 : candidate.code;
    return (code === '40001' ||
        code === 'SQLITE_BUSY' ||
        code === 'SQLITE_BUSY_SNAPSHOT');
}
class OmniExtensionProjectionService extends crud_gen_1.ProjectionResourceService {
    constructor(extensionRepository, ownerRepository, dataSource, scope, dialect, events, omniDefinition, lifecycle, readerCatalog) {
        super(extensionRepository, scope, dialect, events, omniDefinition);
        this.ownerRepository = ownerRepository;
        this.dataSource = dataSource;
        this.omniDefinition = omniDefinition;
        this.lifecycle = lifecycle;
        this.readerCatalog = readerCatalog;
    }
    async getEntity(conditions, _fields, _relations, _databaseName, options) {
        const guid = this.guidFromConditions(conditions);
        const entity = await this.readOne(guid);
        if (!entity && (options === null || options === void 0 ? void 0 : options.failOnNull))
            this.notFound();
        return entity;
    }
    async getEntityListExtended(findOptions = {}, withCount = false) {
        const [extensions, count] = await this.dialect.findMany(this.repository, this.definition, this.scope.scopeId, this.filtersFromFindOptions(findOptions), this.sortingFromFindOptions(findOptions), this.pageFromFindOptions(findOptions));
        const guidColumn = this.definition.identity.column;
        const guids = extensions.map((extension) => extension[guidColumn]);
        if (guids.length === 0)
            return withCount ? [[], count] : [];
        const owners = await this.ownerRepository.find({
            where: {
                scopeId: this.scope.scopeId,
                guid: (0, typeorm_1.In)(guids),
                kind: this.omniDefinition.owner.kind,
                payloadSchemaId: this.omniDefinition.owner.schema.id,
                payloadSchemaVersion: this.omniDefinition.owner.schema.version,
                deletedAt: (0, typeorm_1.IsNull)(),
            },
        });
        const ownersByGuid = new Map(owners.map((owner) => [owner.guid, owner]));
        if (ownersByGuid.size !== extensions.length) {
            throw new Error('Omni extension projection invariant failed: an extension owner is unavailable.');
        }
        const projected = extensions.map((extension) => this.merge(extension, ownersByGuid.get(extension[guidColumn])));
        return withCount ? [projected, count] : projected;
    }
    async createEntity(input) {
        this.rejectUnknownInput(input, true);
        const extension = this.createExtension(input);
        const guid = extension[this.definition.identity.column];
        const owner = this.ownerRepository.create({
            scopeId: this.scope.scopeId,
            guid,
            title: this.omniDefinition.owner.title,
            kind: this.omniDefinition.owner.kind,
            status: this.omniDefinition.owner.status,
            payload: null,
            payloadSchemaId: this.omniDefinition.owner.schema.id,
            payloadSchemaVersion: this.omniDefinition.owner.schema.version,
        });
        try {
            return await this.mutate(async (manager) => {
                var _a, _b;
                await ((_b = (_a = this.lifecycle) === null || _a === void 0 ? void 0 : _a.beforeCreate) === null || _b === void 0 ? void 0 : _b.call(_a, {
                    definition: this.omniDefinition,
                    scope: this.scope,
                    manager,
                    readers: this.readers(manager),
                    input,
                }));
                await manager.getRepository(omni_record_entity_js_1.OmniRecordEntity).save(owner);
                const saved = await manager
                    .getRepository(this.repository.target)
                    .save(extension);
                return this.merge(saved, owner);
            });
        }
        catch (error) {
            if (isUniqueConstraint(error))
                this.identityConflict();
            throw error;
        }
    }
    async updateEntity(conditions, input) {
        this.rejectUnknownInput(input, false);
        const guid = this.guidFromConditions(conditions);
        const expectedRevision = input.expectedRevision;
        if (typeof expectedRevision !== 'number' ||
            !Number.isInteger(expectedRevision) ||
            expectedRevision < 1 ||
            expectedRevision >= crud_gen_1.PROJECTION_INTEGER_MAX) {
            this.invalid(`expectedRevision must be an integer between 1 and ${crud_gen_1.PROJECTION_INTEGER_MAX - 1}.`);
        }
        const patch = this.createValuePatch(guid, input);
        return this.mutate(async (manager) => {
            var _a, _b;
            const owners = manager.getRepository(omni_record_entity_js_1.OmniRecordEntity);
            const extensions = manager.getRepository(this.repository.target);
            const currentOwner = await this.findOwner(guid, manager);
            const currentExtension = await extensions.findOne({
                where: {
                    [this.definition.scope.column]: this.scope.scopeId,
                    [this.definition.identity.column]: guid,
                },
            });
            if (!currentOwner)
                this.notFound();
            if (currentOwner.revision !== expectedRevision) {
                await this.throwUpdateMiss(guid, manager);
            }
            if (!currentExtension) {
                throw new Error('Omni extension projection invariant failed: extension row is unavailable.');
            }
            await ((_b = (_a = this.lifecycle) === null || _a === void 0 ? void 0 : _a.beforeUpdate) === null || _b === void 0 ? void 0 : _b.call(_a, {
                definition: this.omniDefinition,
                scope: this.scope,
                manager,
                readers: this.readers(manager),
                input,
                current: this.merge(currentExtension, currentOwner),
            }));
            const result = await owners
                .createQueryBuilder()
                .update()
                .set({ revision: () => '"revision" + 1' })
                .where('"scopeId" = :scopeId AND "guid" = :guid AND "revision" = :expectedRevision AND "kind" = :kind AND "payloadSchemaId" = :schemaId AND "payloadSchemaVersion" = :schemaVersion AND "deletedAt" IS NULL', {
                scopeId: this.scope.scopeId,
                guid,
                expectedRevision,
                kind: this.omniDefinition.owner.kind,
                schemaId: this.omniDefinition.owner.schema.id,
                schemaVersion: this.omniDefinition.owner.schema.version,
            })
                .execute();
            if (!result.affected)
                await this.throwUpdateMiss(guid, manager);
            const patched = await this.dialect.patchValues(extensions, this.definition, patch);
            if (patched !== 1) {
                throw new Error('Omni extension projection invariant failed: extension row is unavailable.');
            }
            const extension = await extensions.findOneOrFail({
                where: {
                    [this.definition.scope.column]: this.scope.scopeId,
                    [this.definition.identity.column]: guid,
                },
            });
            const owner = await owners.findOneOrFail({
                where: { scopeId: this.scope.scopeId, guid },
            });
            return this.merge(extension, owner);
        });
    }
    async deleteEntity(conditions) {
        const guid = this.guidFromConditions(conditions);
        await this.mutate(async (manager) => {
            var _a, _b;
            const owner = await this.findOwner(guid, manager);
            if (!owner)
                this.notFound();
            const extension = await manager
                .getRepository(this.repository.target)
                .findOne({
                where: {
                    [this.definition.scope.column]: this.scope.scopeId,
                    [this.definition.identity.column]: guid,
                },
            });
            if (!extension) {
                throw new Error('Omni extension projection invariant failed: extension row is unavailable.');
            }
            await ((_b = (_a = this.lifecycle) === null || _a === void 0 ? void 0 : _a.beforeDelete) === null || _b === void 0 ? void 0 : _b.call(_a, {
                definition: this.omniDefinition,
                scope: this.scope,
                manager,
                readers: this.readers(manager),
                input: {},
                current: this.merge(extension, owner),
            }));
            const result = await manager.getRepository(omni_record_entity_js_1.OmniRecordEntity).delete({
                scopeId: this.scope.scopeId,
                guid,
                kind: this.omniDefinition.owner.kind,
                payloadSchemaId: this.omniDefinition.owner.schema.id,
                payloadSchemaVersion: this.omniDefinition.owner.schema.version,
            });
            if (!result.affected)
                this.notFound();
        });
        return true;
    }
    createExtension(input) {
        var _a;
        const extension = {
            [this.definition.scope.column]: this.scope.scopeId,
            [this.definition.payload.column]: this.createPayload(input),
        };
        for (const field of this.definition.fields) {
            const value = input[field.name];
            if (field.requiredOnCreate && (value === undefined || value === null)) {
                this.invalid(`Projection field ${field.name} is required on create.`);
            }
            if (value === null && !field.nullable) {
                this.invalid(`Projection field ${field.name} cannot be null.`);
            }
            if (value !== undefined && field.storage === 'column') {
                extension[(_a = field.column) !== null && _a !== void 0 ? _a : field.name] = this.normalizeValue(field, value);
            }
        }
        return extension;
    }
    readers(manager) {
        var _a;
        return ((_a = this.readerCatalog) !== null && _a !== void 0 ? _a : (0, omni_projection_catalog_js_1.createOmniProjectionReaderCatalog)([
            {
                type: 'extension',
                id: this.omniDefinition.id,
                entity: this.repository.target,
                definition: this.omniDefinition,
            },
        ])).bind(manager, this.scope);
    }
    async mutate(work) {
        try {
            if (this.lifecycle) {
                return await this.dataSource.transaction('SERIALIZABLE', work);
            }
            return await this.dataSource.transaction(work);
        }
        catch (error) {
            if (isRetryableTransactionError(error)) {
                throw this.events.errorConflict('projection.concurrent.write.conflict', {
                    response: {
                        message: 'Omni projection concurrent write conflict; retry the mutation.',
                    },
                });
            }
            throw error;
        }
    }
    createValuePatch(guid, input) {
        var _a;
        const patch = {
            scopeId: this.scope.scopeId,
            guid,
            columnValues: {},
            jsonValues: [],
        };
        for (const field of this.definition.fields) {
            if (field.name === this.definition.identity.column ||
                !hasOwn(input, field.name)) {
                continue;
            }
            const value = input[field.name];
            if (value === null && !field.nullable) {
                this.invalid(`Projection field ${field.name} cannot be null.`);
            }
            const normalized = this.normalizeValue(field, value);
            if (field.storage === 'column') {
                patch.columnValues[(_a = field.column) !== null && _a !== void 0 ? _a : field.name] = normalized;
            }
            else {
                patch.jsonValues.push({ field, value: normalized });
            }
        }
        if (Object.keys(patch.columnValues).length === 0 &&
            patch.jsonValues.length === 0) {
            this.invalid('Projection update requires at least one writable field.');
        }
        return patch;
    }
    async readOne(guid) {
        const extension = await this.repository.findOne({
            where: {
                [this.definition.scope.column]: this.scope.scopeId,
                [this.definition.identity.column]: guid,
            },
        });
        if (!extension)
            return null;
        const owner = await this.findOwner(guid);
        return owner ? this.merge(extension, owner) : null;
    }
    async findOwner(guid, manager) {
        var _a;
        return ((_a = manager === null || manager === void 0 ? void 0 : manager.getRepository(omni_record_entity_js_1.OmniRecordEntity)) !== null && _a !== void 0 ? _a : this.ownerRepository).findOne({
            where: {
                scopeId: this.scope.scopeId,
                guid,
                kind: this.omniDefinition.owner.kind,
                payloadSchemaId: this.omniDefinition.owner.schema.id,
                payloadSchemaVersion: this.omniDefinition.owner.schema.version,
                deletedAt: (0, typeorm_1.IsNull)(),
            },
        });
    }
    merge(extension, owner) {
        return Object.assign(Object.assign({}, this.project(extension)), { scopeId: owner.scopeId, guid: owner.guid, [this.definition.revision.column]: owner.revision, createdAt: owner.createdAt, updatedAt: owner.updatedAt, deletedAt: owner.deletedAt });
    }
    async throwUpdateMiss(guid, manager) {
        if (!(await this.findOwner(guid, manager)))
            this.notFound();
        throw this.events.errorConflict('projection.revision.conflict', {
            response: { message: 'Projection resource revision is stale.' },
        });
    }
    identityConflict() {
        throw this.events.errorConflict('projection.identity.conflict', {
            response: {
                message: 'Projection identity already exists in this scope.',
            },
        });
    }
}
exports.OmniExtensionProjectionService = OmniExtensionProjectionService;
//# sourceMappingURL=omni-extension-projection.service.js.map