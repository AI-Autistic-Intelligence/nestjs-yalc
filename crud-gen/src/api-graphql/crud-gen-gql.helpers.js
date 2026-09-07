"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAskingForCount = void 0;
const isAskingForCount = (info) => {
    try {
        return (info.fieldNodes?.[0].selectionSet?.selections.some((item) => {
            return (item.name.value === 'pageData' &&
                item.selectionSet &&
                item.selectionSet.selections.some((subItem) => subItem.name.value === 'count'));
        }) ?? false);
    }
    catch (e) {
        return false;
    }
};
exports.isAskingForCount = isAskingForCount;
//# sourceMappingURL=crud-gen-gql.helpers.js.map