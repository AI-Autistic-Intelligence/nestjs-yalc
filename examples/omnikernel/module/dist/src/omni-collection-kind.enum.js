"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniCollectionKind = void 0;
const graphql_1 = require("@nestjs/graphql");
var OmniCollectionKind;
(function (OmniCollectionKind) {
    OmniCollectionKind["Collection"] = "collection";
    OmniCollectionKind["Folder"] = "folder";
})(OmniCollectionKind || (exports.OmniCollectionKind = OmniCollectionKind = {}));
(0, graphql_1.registerEnumType)(OmniCollectionKind, {
    name: 'OmniCollectionKind',
});
//# sourceMappingURL=omni-collection-kind.enum.js.map