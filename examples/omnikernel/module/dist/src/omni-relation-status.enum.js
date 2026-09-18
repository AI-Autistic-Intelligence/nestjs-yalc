"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniRelationStatus = void 0;
const graphql_1 = require("@nestjs/graphql");
var OmniRelationStatus;
(function (OmniRelationStatus) {
    OmniRelationStatus["Active"] = "active";
    OmniRelationStatus["Inactive"] = "inactive";
    OmniRelationStatus["Archived"] = "archived";
})(OmniRelationStatus || (exports.OmniRelationStatus = OmniRelationStatus = {}));
(0, graphql_1.registerEnumType)(OmniRelationStatus, {
    name: 'OmniRelationStatus',
});
//# sourceMappingURL=omni-relation-status.enum.js.map