import { FieldNode, DocumentNode, SelectionNode, GraphQLSchema } from 'graphql';
interface VisitedNode {
    depth: number;
}
export declare class GqlComplexityHelper {
    static customMaxDepth: number;
    static processDocumentAST(document: DocumentNode, schema?: GraphQLSchema): void;
    static hasInvalidNode(selectionNode: SelectionNode): void;
    static findInvalidNode(node: FieldNode, visitedNodes: {
        [key: string]: VisitedNode;
    }, depth: number): void;
    static getDefaultVisitedNodes(key: string): {
        [key: string]: VisitedNode;
    };
    static processSelectionNodes(selections: SelectionNode[], visitedNodes: {
        [key: string]: VisitedNode;
    }, depth: number): void;
}
export {};
