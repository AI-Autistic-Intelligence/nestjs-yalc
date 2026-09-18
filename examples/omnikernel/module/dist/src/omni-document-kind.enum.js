"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniDocumentKind = void 0;
const graphql_1 = require("@nestjs/graphql");
var OmniDocumentKind;
(function (OmniDocumentKind) {
    OmniDocumentKind["Document"] = "document";
    OmniDocumentKind["Note"] = "note";
    OmniDocumentKind["Article"] = "article";
    OmniDocumentKind["Page"] = "page";
})(OmniDocumentKind || (exports.OmniDocumentKind = OmniDocumentKind = {}));
(0, graphql_1.registerEnumType)(OmniDocumentKind, {
    name: 'OmniDocumentKind',
});
//# sourceMappingURL=omni-document-kind.enum.js.map