import { FieldNode, DocumentNode, SelectionNode, GraphQLSchema } from 'graphql';
interface IVisitedNode {
    /** at which level the field has been visited */
    depth: number;
}
export declare class GqlComplexityHelper {
    /**
     * We want to avoid circular depencies or queries that are too deep
     * before resolving the GraphQL Request.
     */
    static customMaxDepth: number;
    static processDocumentAST(document: DocumentNode, schema?: GraphQLSchema): void;
    static hasInvalidNode(selectionNode: SelectionNode): void;
    static findInvalidNode(node: FieldNode, visitedNodes: {
        [key: string]: IVisitedNode;
    }, depth: number): void;
    static getDefaultVisitedNodes(key: string): {
        [key: string]: IVisitedNode;
    };
    static processSelectionNodes(selections: SelectionNode[], visitedNodes: {
        [key: string]: IVisitedNode;
    }, depth: number): void;
}
export {};
