export class GqlASTHelper {
    static filterFieldNodes(selections) {
        return selections.filter(GqlASTHelper.isFieldNode);
    }
    static isFieldNode(selectionNode) {
        return selectionNode.kind === 'Field';
    }
}
//# sourceMappingURL=gql-ast.helper.js.map