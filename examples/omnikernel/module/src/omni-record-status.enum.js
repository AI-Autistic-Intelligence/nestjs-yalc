"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniRecordStatus = void 0;
const graphql_1 = require("@nestjs/graphql");
var OmniRecordStatus;
(function (OmniRecordStatus) {
    OmniRecordStatus["Draft"] = "draft";
    OmniRecordStatus["Active"] = "active";
    OmniRecordStatus["Archived"] = "archived";
})(OmniRecordStatus || (exports.OmniRecordStatus = OmniRecordStatus = {}));
(0, graphql_1.registerEnumType)(OmniRecordStatus, {
    name: 'OmniRecordStatus',
});
//# sourceMappingURL=omni-record-status.enum.js.map