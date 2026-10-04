import { registerEnumType } from '@nestjs/graphql';
export var OmniRecordStatus;
(function (OmniRecordStatus) {
    OmniRecordStatus["Draft"] = "draft";
    OmniRecordStatus["Active"] = "active";
    OmniRecordStatus["Archived"] = "archived";
})(OmniRecordStatus || (OmniRecordStatus = {}));
registerEnumType(OmniRecordStatus, {
    name: 'OmniRecordStatus',
});
//# sourceMappingURL=omni-record-status.enum.js.map