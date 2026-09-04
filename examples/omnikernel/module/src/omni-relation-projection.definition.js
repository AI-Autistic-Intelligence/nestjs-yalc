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
    var _a;
    return (_a = definition.relation.allowedKinds) !== null && _a !== void 0 ? _a : [definition.relation.kind];
}
function getOmniRelationProjectionAliases(definition) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return {
        kind: (_b = (_a = definition.aliases) === null || _a === void 0 ? void 0 : _a.kind) !== null && _b !== void 0 ? _b : 'kind',
        source: (_d = (_c = definition.aliases) === null || _c === void 0 ? void 0 : _c.source) !== null && _d !== void 0 ? _d : 'sourceRecordId',
        target: (_f = (_e = definition.aliases) === null || _e === void 0 ? void 0 : _e.target) !== null && _f !== void 0 ? _f : 'targetRecordId',
        payload: (_h = (_g = definition.aliases) === null || _g === void 0 ? void 0 : _g.payload) !== null && _h !== void 0 ? _h : 'payload',
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
            relation.schema.version > 2147483647) {
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