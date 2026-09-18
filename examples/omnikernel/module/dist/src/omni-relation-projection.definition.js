"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOmniRelationProjectionAllowedKinds = getOmniRelationProjectionAllowedKinds;
exports.getOmniRelationProjectionAliases = getOmniRelationProjectionAliases;
exports.defineOmniRelationProjection = defineOmniRelationProjection;
const omni_relation_status_enum_js_1 = require("./omni-relation-status.enum.js");
const omni_relation_kind_contract_js_1 = require("./omni-relation-kind.contract.js");
const publicFieldPattern = /^[_A-Za-z][_0-9A-Za-z]*$/;
function assertFixedValue(value, label, max) {
    if (typeof value !== 'string' ||
        value.trim().length === 0 ||
        value.length > max) {
        throw new TypeError(`${label} must be a non-empty string up to ${max} characters.`);
    }
}
function freeze(definition) {
    if (definition && typeof definition === 'object') {
        Object.values(definition).forEach((value) => {
            if (value && typeof value === 'object')
                freeze(value);
        });
        Object.freeze(definition);
    }
    return definition;
}
function getOmniRelationProjectionAllowedKinds(definition) {
    return definition.relation.allowedKinds ?? [definition.relation.kind];
}
function getOmniRelationProjectionAliases(definition) {
    return {
        kind: definition.aliases?.kind ?? 'kind',
        source: definition.aliases?.source ?? 'sourceRecordId',
        target: definition.aliases?.target ?? 'targetRecordId',
        payload: definition.aliases?.payload ?? 'payload',
    };
}
function defineOmniRelationProjection(definition) {
    assertFixedValue(definition.id, 'Omni relation projection id', 128);
    const relation = definition.relation;
    if (!relation || typeof relation !== 'object') {
        throw new TypeError('Omni relation projection relation must be an object.');
    }
    if (relation.kind !== undefined && relation.allowedKinds !== undefined) {
        throw new TypeError('Omni relation projection accepts either kind or allowedKinds, not both.');
    }
    const allowedKinds = getOmniRelationProjectionAllowedKinds(definition);
    if (!Array.isArray(allowedKinds) ||
        allowedKinds.length === 0 ||
        new Set(allowedKinds).size !== allowedKinds.length) {
        throw new TypeError('Omni relation projection allowedKinds must be a non-empty unique list.');
    }
    for (const kind of allowedKinds) {
        assertFixedValue(kind, 'Omni relation projection kind', 64);
        if (!omni_relation_kind_contract_js_1.omniRelationKindPattern.test(kind)) {
            throw new TypeError('Omni relation projection kind must use lowercase letters, digits, and underscores.');
        }
    }
    assertFixedValue(relation.sourceKind, 'Omni relation projection source kind', 64);
    assertFixedValue(relation.targetKind, 'Omni relation projection target kind', 64);
    if (relation.status !== undefined &&
        !Object.values(omni_relation_status_enum_js_1.OmniRelationStatus).includes(relation.status)) {
        throw new TypeError('Omni relation projection status must be an Omni relation status.');
    }
    if (relation.schema) {
        assertFixedValue(relation.schema.id, 'Omni relation projection schema id', 128);
        if (!Number.isInteger(relation.schema.version) ||
            relation.schema.version < 1 ||
            relation.schema.version > 2_147_483_647) {
            throw new TypeError('Omni relation projection schema version must be a positive signed 32-bit integer.');
        }
    }
    const aliases = getOmniRelationProjectionAliases(definition);
    if (new Set(Object.values(aliases)).size !== Object.keys(aliases).length) {
        throw new TypeError('Omni relation projection aliases must be unique.');
    }
    for (const [role, alias] of Object.entries(aliases)) {
        if (!publicFieldPattern.test(alias)) {
            throw new TypeError(`Omni relation projection ${role} alias must be a GraphQL-safe field name.`);
        }
    }
    return freeze(definition);
}
//# sourceMappingURL=omni-relation-projection.definition.js.map