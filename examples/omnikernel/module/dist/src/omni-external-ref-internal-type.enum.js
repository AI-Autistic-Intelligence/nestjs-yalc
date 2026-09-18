"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniExternalRefInternalType = void 0;
const graphql_1 = require("@nestjs/graphql");
var OmniExternalRefInternalType;
(function (OmniExternalRefInternalType) {
    OmniExternalRefInternalType["Record"] = "record";
    OmniExternalRefInternalType["Document"] = "document";
    OmniExternalRefInternalType["Collection"] = "collection";
})(OmniExternalRefInternalType || (exports.OmniExternalRefInternalType = OmniExternalRefInternalType = {}));
(0, graphql_1.registerEnumType)(OmniExternalRefInternalType, {
    name: 'OmniExternalRefInternalType',
});
//# sourceMappingURL=omni-external-ref-internal-type.enum.js.map