/**
 * Generated REST mappers instantiate DTOs directly. Keep server-owned scope
 * and lifecycle fields out of that copy so REST and GraphQL expose the same
 * public contract.
 */
export function assignOmniPublicDto(target, data) {
    const { scopeId: _scopeId, deletedAt: _deletedAt, ...publicData } = data;
    Object.assign(target, publicData);
    delete target.scopeId;
    delete target.deletedAt;
}
//# sourceMappingURL=omni-dto.helpers.js.map