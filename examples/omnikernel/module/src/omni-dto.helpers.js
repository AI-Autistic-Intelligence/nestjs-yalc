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
exports.assignOmniPublicDto = assignOmniPublicDto;
function assignOmniPublicDto(target, data) {
    const _a = data, { scopeId: _scopeId, deletedAt: _deletedAt } = _a, publicData = __rest(_a, ["scopeId", "deletedAt"]);
    Object.assign(target, publicData);
    delete target.scopeId;
    delete target.deletedAt;
}
//# sourceMappingURL=omni-dto.helpers.js.map