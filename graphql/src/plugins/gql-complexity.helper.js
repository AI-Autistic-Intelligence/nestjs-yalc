"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GqlComplexityHelper = void 0;
const graphql_1 = require("graphql");
const gql_ast_helper_js_1 = require("./gql-ast.helper.js");
const gql_error_js_1 = require("./gql.error.js");
const MAX_EXECUTABLE_DEFINITIONS = 50;
const MAX_DEPTH = 3;
const returnTypeMap = {
    ManageUser_getUser: 'UserType',
    ManageUser_getUserGrid: 'UserGrid',
    User: 'UserType',
};
class GqlComplexityHelper {
    static processDocumentAST(document, schema) {
        document.definitions
            .filter(graphql_1.isExecutableDefinitionNode)
            .forEach((operation) => {
            var _a, _b, _c;
            const { selectionSet } = operation;
            const { name } = selectionSet.selections[0];
            const queryContext = (_a = schema === null || schema === void 0 ? void 0 : schema.getQueryType()) === null || _a === void 0 ? void 0 : _a.getFields()[name.value];
            GqlComplexityHelper.customMaxDepth =
                (_c = (_b = queryContext === null || queryContext === void 0 ? void 0 : queryContext.extensions) === null || _b === void 0 ? void 0 : _b.complexity) !== null && _c !== void 0 ? _c : MAX_DEPTH;
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
        var _a, _b;
        if (!gql_ast_helper_js_1.GqlASTHelper.isFieldNode(selectionNode)) {
            return;
        }
        const selections = (_b = (_a = selectionNode.selectionSet) === null || _a === void 0 ? void 0 : _a.selections) === null || _b === void 0 ? void 0 : _b.concat();
        if (selections === undefined) {
            return;
        }
        const defaultVisitedNodes = GqlComplexityHelper.getDefaultVisitedNodes(selectionNode.name.value);
        for (const node of gql_ast_helper_js_1.GqlASTHelper.filterFieldNodes(selections)) {
            GqlComplexityHelper.findInvalidNode(node, defaultVisitedNodes, 1);
        }
    }
    static findInvalidNode(node, visitedNodes, depth) {
        var _a;
        const { name, selectionSet } = node;
        const { value: fieldName } = name;
        const notNodesField = fieldName !== 'nodes';
        const shouldSkipFieldName = fieldName === 'ID' ||
            (notNodesField && fieldName[0] !== fieldName.toUpperCase()[0]);
        if (shouldSkipFieldName) {
            return;
        }
        const foundVisitedNode = (_a = visitedNodes[fieldName]) !== null && _a !== void 0 ? _a : visitedNodes[returnTypeMap[fieldName]];
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