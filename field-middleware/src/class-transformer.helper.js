"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseArray = ParseArray;
exports.parseArray = parseArray;
exports.ParseBoolean = ParseBoolean;
exports.parseBoolean = parseBoolean;
exports.ParseNumber = ParseNumber;
exports.parseNumber = parseNumber;
exports.ParseInt = ParseInt;
exports.parseInt = parseInt;
const class_transformer_1 = require("class-transformer");
function ParseArray({ separator = ',' } = {}) {
    return (0, class_transformer_1.Transform)(({ value }) => parseArray(value, separator));
}
function parseArray(value, separator = ',') {
    if (!value) {
        return [];
    }
    if (Array.isArray(value)) {
        return value;
    }
    if (typeof value !== 'string') {
        return [value];
    }
    return value.split(separator).filter((item) => item.length > 0);
}
function ParseBoolean() {
    return (0, class_transformer_1.Transform)(({ value }) => parseBoolean(value));
}
function parseBoolean(value) {
    if (typeof value === 'boolean') {
        return value;
    }
    if (typeof value !== 'string') {
        return false;
    }
    return value === 'true';
}
function ParseNumber() {
    return (0, class_transformer_1.Transform)(({ value }) => parseNumber(value));
}
function parseNumber(value) {
    if (typeof value === 'number') {
        return value;
    }
    if (typeof value !== 'string' || value === '') {
        return NaN;
    }
    return Number(value);
}
function ParseInt() {
    return (0, class_transformer_1.Transform)(({ value }) => parseInt(value));
}
function parseInt(value) {
    if (typeof value === 'number') {
        return value;
    }
    if (typeof value !== 'string' || Number(value) % 1 !== 0) {
        return NaN;
    }
    return Number.parseInt(value);
}
//# sourceMappingURL=class-transformer.helper.js.map