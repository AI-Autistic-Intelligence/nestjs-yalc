import { registerEnumType } from '@nestjs/graphql';
export var OmniCollectionKind;
(function (OmniCollectionKind) {
    OmniCollectionKind["Collection"] = "collection";
    OmniCollectionKind["Folder"] = "folder";
})(OmniCollectionKind || (OmniCollectionKind = {}));
registerEnumType(OmniCollectionKind, {
    name: 'OmniCollectionKind',
});
//# sourceMappingURL=omni-collection-kind.enum.js.map