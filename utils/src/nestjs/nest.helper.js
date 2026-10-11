"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProviderObject = isProviderObject;
function isProviderObject(obj) {
    return obj !== null && typeof obj === 'object' && 'provide' in obj;
}
//# sourceMappingURL=nest.helper.js.map