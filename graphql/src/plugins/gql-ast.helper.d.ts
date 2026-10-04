import { FieldNode, SelectionNode } from 'graphql';
export declare class GqlASTHelper {
    static filterFieldNodes(selections: SelectionNode[]): FieldNode[];
    static isFieldNode(selectionNode: SelectionNode): selectionNode is FieldNode;
}
