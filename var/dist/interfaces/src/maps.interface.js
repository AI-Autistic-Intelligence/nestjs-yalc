"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFieldMapperProperty = exports.isFieldMapper = void 0;
const isFieldMapper = (object) => {
    const casted = object;
    const values = Object.values(casted);
    return values.length > 0 && values.every((p) => !!p.dst);
};
exports.isFieldMapper = isFieldMapper;
const isFieldMapperProperty = (object) => {
    return object && !!object.dst;
};
exports.isFieldMapperProperty = isFieldMapperProperty;
//# sourceMappingURL=maps.interface.js.map