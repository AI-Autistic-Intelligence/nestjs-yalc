"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignOmniPublicDto = assignOmniPublicDto;
function assignOmniPublicDto(target, data) {
    const { scopeId: _scopeId, deletedAt: _deletedAt, ...publicData } = data;
    Object.assign(target, publicData);
    delete target.scopeId;
    delete target.deletedAt;
}
//# sourceMappingURL=omni-dto.helpers.js.map