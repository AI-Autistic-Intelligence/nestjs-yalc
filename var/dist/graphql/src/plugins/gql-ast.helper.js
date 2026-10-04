"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GqlASTHelper = void 0;
class GqlASTHelper {
    static filterFieldNodes(selections) {
        return selections.filter(GqlASTHelper.isFieldNode);
    }
    static isFieldNode(selectionNode) {
        return selectionNode.kind === 'Field';
    }
}
exports.GqlASTHelper = GqlASTHelper;
//# sourceMappingURL=gql-ast.helper.js.map