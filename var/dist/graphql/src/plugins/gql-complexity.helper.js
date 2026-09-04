import { isExecutableDefinitionNode, } from 'graphql';
import { GqlASTHelper } from './gql-ast.helper';
import { GqlError, GqlErrorMsgs } from './gql.error';
const MAX_EXECUTABLE_DEFINITIONS = 50;
const MAX_DEPTH = 3;
const returnTypeMap = {
    ManageUser_getUser: 'UserType',
    ManageUser_getUserGrid: 'UserGrid',
    User: 'UserType',
};
export class GqlComplexityHelper {
    static processDocumentAST(document, schema) {
        document.definitions
            .filter(isExecutableDefinitionNode)
            .forEach((operation) => {
            const { selectionSet } = operation;
            const { name } = selectionSet.selections[0];
            const queryContext = schema?.getQueryType()?.getFields()[name.value];
            GqlComplexityHelper.customMaxDepth =
                queryContext?.extensions?.complexity ?? MAX_DEPTH;
            const totalOperations = selectionSet.selections.length;
            if (totalOperations > MAX_EXECUTABLE_DEFINITIONS) {
                throw new GqlError(GqlErrorMsgs.MAX_OPERATIONS);
            }
            selectionSet.selections.forEach((selectionNode) => {
                GqlComplexityHelper.hasInvalidNode(selectionNode);
            });
        });
    }
    static hasInvalidNode(selectionNode) {
        if (!GqlASTHelper.isFieldNode(selectionNode)) {
            return;
        }
        const selections = selectionNode.selectionSet?.selections?.concat();
        if (selections === undefined) {
            return;
        }
        const defaultVisitedNodes = GqlComplexityHelper.getDefaultVisitedNodes(selectionNode.name.value);
        for (const node of GqlASTHelper.filterFieldNodes(selections)) {
            GqlComplexityHelper.findInvalidNode(node, defaultVisitedNodes, 1);
        }
    }
    static findInvalidNode(node, visitedNodes, depth) {
        const { name, selectionSet } = node;
        const { value: fieldName } = name;
        const notNodesField = fieldName !== 'nodes';
        const shouldSkipFieldName = fieldName === 'ID' ||
            (notNodesField && fieldName[0] !== fieldName.toUpperCase()[0]);
        if (shouldSkipFieldName) {
            return;
        }
        const foundVisitedNode = visitedNodes[fieldName] ?? visitedNodes[returnTypeMap[fieldName]];
        if (foundVisitedNode && foundVisitedNode.depth !== depth) {
            throw new GqlError(GqlErrorMsgs.CIRCULAR_DEPENDENCY_FOUND);
        }
        if (notNodesField)
            visitedNodes[fieldName] = { depth };
        if (selectionSet) {
            if (notNodesField)
                depth++;
            if (depth > GqlComplexityHelper.customMaxDepth) {
                throw new GqlError(GqlErrorMsgs.MAX_DEPTH);
            }
            return GqlComplexityHelper.processSelectionNodes(selectionSet.selections.concat(), visitedNodes, depth);
        }
    }
    static getDefaultVisitedNodes(key) {
        const result = {};
        const operationReturnType = returnTypeMap[key];
        if (operationReturnType) {
            result[operationReturnType] = { depth: 0 };
        }
        return result;
    }
    static processSelectionNodes(selections, visitedNodes, depth) {
        for (const node of GqlASTHelper.filterFieldNodes(selections)) {
            GqlComplexityHelper.findInvalidNode(node, visitedNodes, depth);
        }
    }
}
//# sourceMappingURL=gql-complexity.helper.js.map