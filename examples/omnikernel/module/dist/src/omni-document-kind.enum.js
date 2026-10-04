import { registerEnumType } from '@nestjs/graphql';
export var OmniDocumentKind;
(function (OmniDocumentKind) {
    OmniDocumentKind["Document"] = "document";
    OmniDocumentKind["Note"] = "note";
    OmniDocumentKind["Article"] = "article";
    OmniDocumentKind["Page"] = "page";
})(OmniDocumentKind || (OmniDocumentKind = {}));
registerEnumType(OmniDocumentKind, {
    name: 'OmniDocumentKind',
});
//# sourceMappingURL=omni-document-kind.enum.js.map