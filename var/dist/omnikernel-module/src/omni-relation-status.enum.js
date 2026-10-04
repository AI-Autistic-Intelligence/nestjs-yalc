import { registerEnumType } from '@nestjs/graphql';
export var OmniRelationStatus;
(function (OmniRelationStatus) {
    OmniRelationStatus["Active"] = "active";
    OmniRelationStatus["Inactive"] = "inactive";
    OmniRelationStatus["Archived"] = "archived";
})(OmniRelationStatus || (OmniRelationStatus = {}));
registerEnumType(OmniRelationStatus, {
    name: 'OmniRelationStatus',
});
//# sourceMappingURL=omni-relation-status.enum.js.map