export type ODataOrderDirection = 'asc' | 'desc';
export interface ODataOrderBy {
    field: string;
    direction: ODataOrderDirection;
}
export interface ODataQueryParams {
    select?: string[] | null;
    filter?: string | null;
    orderBy?: ODataOrderBy[] | null;
    top?: number | null;
    skip?: number | null;
    count?: boolean | null;
    expand?: string[] | null;
}
export declare function parseODataQueryParams(query: Record<string, unknown>): ODataQueryParams;
