"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GqlComplexityHelper = void 0;
const graphql_1 = require("graphql");
const gql_ast_helper_js_1 = require("./gql-ast.helper.js");
const gql_error_js_1 = require("./gql.error.js");
const MAX_EXECUTABLE_DEFINITIONS = 50;
const MAX_DEPTH = 3;
// GraphQL Object Type returned by queries/mutations/fields that might have a circular dependency.
const returnTypeMap = {
    ManageUser_getUser: 'UserType',
    ManageUser_getUserGrid: 'UserGrid',
    User: 'UserType', // Temporary solution for wrong type returned by the 'User' in UserEmail object type.
};
class GqlComplexityHelper {
    static processDocumentAST(document, schema) {
        document.definitions
            .filter(graphql_1.isExecutableDefinitionNode)
            .forEach((operation) => {
            const { selectionSet } = operation;
            const { name } = selectionSet.selections[0];
            const queryContext = schema?.getQueryType()?.getFields()[name.value];
            GqlComplexityHelper.customMaxDepth =
                queryContext?.extensions?.complexity ?? MAX_DEPTH;
            const totalOperations = selectionSet.selections.length;
            if (totalOperations > MAX_EXECUTABLE_DEFINITIONS) {
                throw new gql_error_js_1.GqlError(gql_error_js_1.GqlErrorMsgs.MAX_OPERATIONS);
            }
            selectionSet.selections.forEach((selectionNode) => {
                GqlComplexityHelper.hasInvalidNode(selectionNode);
            });
        });
    }
    static hasInvalidNode(selectionNode) {
        if (!gql_ast_helper_js_1.GqlASTHelper.isFieldNode(selectionNode)) {
            return;
        }
        const selections = selectionNode.selectionSet?.selections?.concat();
        if (selections === undefined) {
            return;
        }
        const defaultVisitedNodes = GqlComplexityHelper.getDefaultVisitedNodes(selectionNode.name.value);
        for (const node of gql_ast_helper_js_1.GqlASTHelper.filterFieldNodes(selections)) {
            GqlComplexityHelper.findInvalidNode(node, defaultVisitedNodes, 1);
        }
    }
    static findInvalidNode(node, visitedNodes, depth) {
        const { name, selectionSet } = node;
        const { value: fieldName } = name;
        const notNodesField = fieldName !== 'nodes';
        // Process non-captilized request resources should not be supported
        // It's still necessary to visit the selectionSet inside 'nodes' (CrudGen).
        // ID is used as a field name in entities, not a nested resource, it should be skipped.
        const shouldSkipFieldName = fieldName === 'ID' ||
            (notNodesField && fieldName[0] !== fieldName.toUpperCase()[0]);
        if (shouldSkipFieldName) {
            return;
        }
        const returnType = returnTypeMap[fieldName];
        const foundVisitedNode = visitedNodes[fieldName] ?? (returnType !== undefined ? visitedNodes[returnType] : undefined);
        if (foundVisitedNode && foundVisitedNode.depth !== depth) {
            throw new gql_error_js_1.GqlError(gql_error_js_1.GqlErrorMsgs.CIRCULAR_DEPENDENCY_FOUND);
        }
        if (notNodesField)
            visitedNodes[fieldName] = { depth };
        if (selectionSet) {
            if (notNodesField)
                depth++;
            if (depth > GqlComplexityHelper.customMaxDepth) {
                throw new gql_error_js_1.GqlError(gql_error_js_1.GqlErrorMsgs.MAX_DEPTH);
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
        for (const node of gql_ast_helper_js_1.GqlASTHelper.filterFieldNodes(selections)) {
            GqlComplexityHelper.findInvalidNode(node, visitedNodes, depth);
        }
    }
}
exports.GqlComplexityHelper = GqlComplexityHelper;
//# sourceMappingURL=gql-complexity.helper.js.map