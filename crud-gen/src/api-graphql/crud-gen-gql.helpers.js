"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAskingForCount = void 0;
const isAskingForCount = (info) => {
    var _a, _b, _c;
    try {
        return ((_c = (_b = (_a = info.fieldNodes) === null || _a === void 0 ? void 0 : _a[0].selectionSet) === null || _b === void 0 ? void 0 : _b.selections.some((item) => {
            return (item.name.value === 'pageData' &&
                item.selectionSet &&
                item.selectionSet.selections.some((subItem) => subItem.name.value === 'count'));
        })) !== null && _c !== void 0 ? _c : false);
    }
    catch (e) {
        return false;
    }
};
exports.isAskingForCount = isAskingForCount;
//# sourceMappingURL=crud-gen-gql.helpers.js.map