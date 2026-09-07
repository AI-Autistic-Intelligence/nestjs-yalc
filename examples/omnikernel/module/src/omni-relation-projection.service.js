"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniRelationProjectionService = void 0;
const common_1 = require("@nestjs/common");
const crud_gen_1 = require("@nest-yalc-2/crud-gen");
const typeorm_1 = require("typeorm");
const omni_record_entity_js_1 = require("./base/omni-record.entity.js");
const omni_relation_entity_js_1 = require("./base/omni-relation.entity.js");
const omni_projection_catalog_js_1 = require("./omni-projection.catalog.js");
const omni_relation_projection_definition_js_1 = require("./omni-relation-projection.definition.js");
const omni_relation_service_js_1 = require("./omni-relation.service.js");
const omni_relation_status_enum_js_1 = require("./omni-relation-status.enum.js");
function hasOwn(input, key) {
    return Object.prototype.hasOwnProperty.call(input, key);
}
function isRetryableTransactionError(error) {
    const candidate = error;
    const code = candidate?.driverError?.code ?? candidate?.code;
    return (code === '40001' ||
        code === 'SQLITE_BUSY' ||
        code === 'SQLITE_BUSY_SNAPSHOT');
}
class OmniRelationProjectionService extends omni_relation_service_js_1.OmniRelationService {
    constructor(repository, scope, relationDeletion, recordRepository, kinds, definition, dataSource, lifecycle, readerCatalog) {
        super(repository, scope, relationDeletion, recordRepository, kinds);
        this.relationDeletion = relationDeletion;
        this.definition = definition;
        this.dataSource = dataSource;
        this.lifecycle = lifecycle;
        this.readerCatalog = readerCatalog;
        for (const kind of (0, omni_relation_projection_definition_js_1.getOmniRelationProjectionAllowedKinds)(definition)) {
            try {
                kinds.assert(kind);
            }
            catch (error) {
                throw new TypeError(error instanceof Error
                    ? error.message
                    : 'Omni relation projection kind is not registered.');
            }
        }
    }
    async createEntity(input, findOptions, returnEntity = true) {
        const normalized = this.normalizeInput(input);
        this.rejectFixedFields(normalized, true);
        this.selectCreateKind(normalized);
        const created = this.createValues(normalized);
        if (!this.lifecycle) {
            const result = await super.createEntity(created, findOptions, returnEntity);
            return typeof result === 'boolean' ? result : this.publicEntity(result);
        }
        const result = await this.mutate(async (manager) => {
            await this.assertRelation(created, manager.getRepository(omni_record_entity_js_1.OmniRecordEntity));
            await this.lifecycle.beforeCreate?.({
                definition: this.definition,
                scope: this.scope,
                manager,
                readers: this.readers(manager),
                input: this.publicInput(normalized),
            });
            const repository = manager.getRepository(omni_relation_entity_js_1.OmniRelationEntity);
            const entity = {
                ...created,
                scopeId: this.scopeId,
            };
            const guid = this.requiredIdentifier(entity.guid, 'guid');
            await repository.insert(entity);
            if (!returnEntity)
                return true;
            return repository.findOneOrFail({
                where: {
                    scopeId: this.scopeId,
                    guid,
                    ...this.definitionFilters(),
                },
            });
        });
        return typeof result === 'boolean' ? result : this.publicEntity(result);
    }
    async getEntity(conditions, fields, relations, databaseName, options) {
        const entity = await super.getEntity(this.withDefinitionConditions(conditions), fields, relations, databaseName, options);
        return entity ? this.publicEntity(entity) : entity;
    }
    async getEntityListExtended(findOptions = {}, withCount = false, relations, databaseName) {
        this.rejectFixedFilters(findOptions.where);
        const where = {
            operator: crud_gen_1.Operators.AND,
            filters: this.definitionFilters(),
            ...(findOptions.where ? { childExpressions: [findOptions.where] } : {}),
        };
        if (withCount) {
            const result = await super.getEntityListExtended({ ...findOptions, where }, true, relations, databaseName);
            return [result[0].map((entity) => this.publicEntity(entity)), result[1]];
        }
        const result = await super.getEntityListExtended({ ...findOptions, where }, false, relations, databaseName);
        return result.map((entity) => this.publicEntity(entity));
    }
    async updateEntity(conditions, input, _findOptions, returnEntity = true) {
        const normalized = this.normalizeInput(input);
        this.rejectFixedFields(normalized);
        this.rejectImmutableEndpoints(normalized);
        this.validatePayload(normalized);
        const expectedRevision = normalized.expectedRevision;
        if (typeof expectedRevision !== 'number' ||
            !Number.isInteger(expectedRevision) ||
            expectedRevision < 1 ||
            expectedRevision >= crud_gen_1.PROJECTION_INTEGER_MAX) {
            throw new common_1.BadRequestException(`expectedRevision must be an integer between 1 and ${crud_gen_1.PROJECTION_INTEGER_MAX - 1}.`);
        }
        const fixedConditions = this.withDefinitionConditions(this.normalizeConditions(conditions));
        const { expectedRevision: _expectedRevision, ...changes } = normalized;
        if (Object.keys(changes).length === 0) {
            throw new common_1.BadRequestException('Omni relation update requires metadata.');
        }
        const result = await this.mutate(async (manager) => {
            const repository = manager.getRepository(omni_relation_entity_js_1.OmniRelationEntity);
            const current = await repository.findOne({ where: fixedConditions });
            if (!current)
                this.notFound();
            if (current.revision !== expectedRevision) {
                throw new common_1.ConflictException('Omni relation revision conflict.');
            }
            await this.assertRelation({ ...current, ...changes }, manager.getRepository(omni_record_entity_js_1.OmniRecordEntity));
            await this.lifecycle?.beforeUpdate?.({
                definition: this.definition,
                scope: this.scope,
                manager,
                readers: this.readers(manager),
                input: this.publicInput(normalized),
                current,
            });
            const result = await repository
                .createQueryBuilder()
                .update()
                .set({ ...changes, revision: () => '"revision" + 1' })
                .where('"scopeId" = :scopeId', { scopeId: this.scopeId })
                .andWhere('"guid" = :guid', { guid: current.guid })
                .andWhere('"revision" = :expectedRevision', { expectedRevision })
                .andWhere('"kind" IN (:...kinds)', {
                kinds: [...(0, omni_relation_projection_definition_js_1.getOmniRelationProjectionAllowedKinds)(this.definition)],
            })
                .andWhere('"status" = :status', {
                status: this.definition.relation.status ?? omni_relation_status_enum_js_1.OmniRelationStatus.Active,
            })
                .andWhere(this.definition.relation.schema
                ? '"payloadSchemaId" = :schemaId AND "payloadSchemaVersion" = :schemaVersion'
                : '"payloadSchemaId" IS NULL AND "payloadSchemaVersion" IS NULL', this.definition.relation.schema
                ? {
                    schemaId: this.definition.relation.schema.id,
                    schemaVersion: this.definition.relation.schema.version,
                }
                : {})
                .execute();
            if (result.affected !== 1) {
                const existing = await repository.findOne({ where: fixedConditions });
                if (!existing)
                    this.notFound();
                throw new common_1.ConflictException('Omni relation revision conflict.');
            }
            if (!returnEntity)
                return true;
            return repository.findOneOrFail({ where: fixedConditions });
        });
        return typeof result === 'boolean' ? result : this.publicEntity(result);
    }
    async deleteEntity(conditions) {
        const fixedConditions = this.withDefinitionConditions(this.normalizeConditions(conditions));
        if (!this.lifecycle)
            return super.deleteEntity(fixedConditions);
        return this.mutate(async (manager) => {
            const repository = manager.getRepository(omni_relation_entity_js_1.OmniRelationEntity);
            const current = await repository.findOne({ where: fixedConditions });
            if (!current)
                this.notFound();
            await this.lifecycle.beforeDelete?.({
                definition: this.definition,
                scope: this.scope,
                manager,
                readers: this.readers(manager),
                input: {},
                current,
            });
            const result = this.relationDeletion === 'hard'
                ? await repository.delete(fixedConditions)
                : await repository.update(fixedConditions, { deletedAt: new Date() });
            if (result.affected !== 1)
                this.notFound();
            return true;
        });
    }
    assertEndpointKinds(source, target) {
        if (source.kind !== this.definition.relation.sourceKind ||
            target.kind !== this.definition.relation.targetKind) {
            throw new common_1.BadRequestException('Omni relation endpoints do not match the registered resource kinds.');
        }
    }
    createValues(input) {
        return {
            ...input,
            kind: input.kind,
            status: this.definition.relation.status ?? omni_relation_status_enum_js_1.OmniRelationStatus.Active,
            ...(this.definition.relation.schema
                ? {
                    payloadSchemaId: this.definition.relation.schema.id,
                    payloadSchemaVersion: this.definition.relation.schema.version,
                }
                : {}),
        };
    }
    publicEntity(entity) {
        const aliases = (0, omni_relation_projection_definition_js_1.getOmniRelationProjectionAliases)(this.definition);
        return {
            ...entity,
            ...(aliases.kind === 'kind' ? {} : { [aliases.kind]: entity.kind }),
            ...(aliases.source === 'sourceRecordId'
                ? {}
                : { [aliases.source]: entity.sourceRecordId }),
            ...(aliases.target === 'targetRecordId'
                ? {}
                : { [aliases.target]: entity.targetRecordId }),
            ...(aliases.payload === 'payload'
                ? {}
                : { [aliases.payload]: entity.payload }),
        };
    }
    publicInput(input) {
        const aliases = (0, omni_relation_projection_definition_js_1.getOmniRelationProjectionAliases)(this.definition);
        const output = { ...input };
        for (const [field, alias] of [
            ['kind', aliases.kind],
            ['sourceRecordId', aliases.source],
            ['targetRecordId', aliases.target],
            ['payload', aliases.payload],
        ]) {
            if (field === alias || !hasOwn(output, field))
                continue;
            output[alias] = output[field];
            delete output[field];
        }
        return output;
    }
    selectCreateKind(input) {
        const allowed = (0, omni_relation_projection_definition_js_1.getOmniRelationProjectionAllowedKinds)(this.definition);
        if (allowed.length === 1) {
            if (input.kind !== undefined) {
                throw new common_1.BadRequestException('Omni relation kind is server-owned.');
            }
            input.kind = allowed[0];
            return;
        }
        if (typeof input.kind !== 'string' || !allowed.includes(input.kind)) {
            throw new common_1.BadRequestException('Omni relation kind is not allowed by this resource.');
        }
    }
    normalizeInput(input) {
        const normalized = { ...input };
        const aliases = (0, omni_relation_projection_definition_js_1.getOmniRelationProjectionAliases)(this.definition);
        for (const [alias, field] of [
            [aliases.kind, 'kind'],
            [aliases.source, 'sourceRecordId'],
            [aliases.target, 'targetRecordId'],
            [aliases.payload, 'payload'],
        ]) {
            if (alias === field)
                continue;
            if (!hasOwn(normalized, alias))
                continue;
            if (hasOwn(normalized, field)) {
                throw new common_1.BadRequestException(`Omni relation ${alias} conflicts with ${field}.`);
            }
            normalized[field] = normalized[alias];
            delete normalized[alias];
        }
        return normalized;
    }
    normalizeConditions(conditions) {
        return this.normalizeInput(conditions);
    }
    rejectFixedFields(input, allowKind = false) {
        for (const field of [
            ...(allowKind ? [] : ['kind']),
            'status',
            'payloadSchemaId',
            'payloadSchemaVersion',
        ]) {
            if (hasOwn(input, field)) {
                throw new common_1.BadRequestException(`Omni relation ${field} is server-owned.`);
            }
        }
    }
    rejectImmutableEndpoints(input) {
        for (const field of ['guid', 'sourceRecordId', 'targetRecordId']) {
            if (hasOwn(input, field)) {
                throw new common_1.BadRequestException(`Omni relation ${field} is immutable.`);
            }
        }
    }
    validatePayload(input) {
        if (hasOwn(input, 'payload') &&
            input.payload !== null &&
            (typeof input.payload !== 'object' || Array.isArray(input.payload))) {
            throw new common_1.BadRequestException('payload must be a JSON object or null.');
        }
    }
    withDefinitionConditions(conditions) {
        if (typeof conditions === 'string') {
            return { guid: conditions, ...this.definitionFilters() };
        }
        if (Array.isArray(conditions)) {
            return conditions.map((condition) => this.withDefinitionConditions(condition));
        }
        this.assertFixedConditions(conditions);
        return { ...conditions, ...this.definitionFilters() };
    }
    definitionFilters() {
        const relation = this.definition.relation;
        return {
            kind: (0, typeorm_1.In)([...(0, omni_relation_projection_definition_js_1.getOmniRelationProjectionAllowedKinds)(this.definition)]),
            status: relation.status ?? omni_relation_status_enum_js_1.OmniRelationStatus.Active,
            ...(relation.schema
                ? {
                    payloadSchemaId: relation.schema.id,
                    payloadSchemaVersion: relation.schema.version,
                }
                : {
                    payloadSchemaId: (0, typeorm_1.IsNull)(),
                    payloadSchemaVersion: (0, typeorm_1.IsNull)(),
                }),
        };
    }
    assertFixedConditions(conditions) {
        for (const field of Object.keys(this.definitionFilters())) {
            if (hasOwn(conditions, field)) {
                throw new common_1.BadRequestException(`Omni relation ${field} is server-owned.`);
            }
        }
    }
    rejectFixedFilters(where) {
        if (!where || typeof where !== 'object')
            return;
        if (Array.isArray(where)) {
            where.forEach((entry) => this.rejectFixedFilters(entry));
            return;
        }
        const candidate = where;
        for (const field of Object.keys(this.definitionFilters())) {
            if (hasOwn(candidate, field)) {
                throw new common_1.BadRequestException(`Omni relation ${field} is server-owned.`);
            }
        }
        if (candidate.filters && typeof candidate.filters === 'object') {
            this.rejectFixedFilters(candidate.filters);
        }
        if (Array.isArray(candidate.childExpressions)) {
            candidate.childExpressions.forEach((entry) => this.rejectFixedFilters(entry));
        }
    }
    readers(manager) {
        return (this.readerCatalog ??
            (0, omni_projection_catalog_js_1.createOmniProjectionReaderCatalog)([
                {
                    type: 'relation',
                    id: this.definition.id,
                    definition: this.definition,
                },
            ])).bind(manager, this.scope);
    }
    async mutate(work) {
        if (!this.lifecycle)
            return work(this.getRepositoryWrite().manager);
        if (!this.dataSource) {
            throw new TypeError('Omni relation lifecycle requires a DataSource for serializable mutations.');
        }
        try {
            return await this.dataSource.transaction('SERIALIZABLE', work);
        }
        catch (error) {
            if (isRetryableTransactionError(error)) {
                throw new common_1.ConflictException('Omni projection concurrent write conflict; retry the mutation.');
            }
            throw error;
        }
    }
}
exports.OmniRelationProjectionService = OmniRelationProjectionService;
//# sourceMappingURL=omni-relation-projection.service.js.map