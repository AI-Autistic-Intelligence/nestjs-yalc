export type ODataOrderDirection = 'asc' | 'desc';
export interface ODataOrderBy {
    field: string;
    direction: ODataOrderDirection;
}
/**
 * Parsed representation of the OData-like query façade.
 *
 * This type is intentionally generic and does not depend on any specific ORM.
 * Mapping to concrete query builders (e.g. TypeORM, Prisma) should happen in
 * a thin adapter layer.
 */
export interface ODataQueryParams {
    select?: string[] | null;
    /**
     * Raw $filter expression string. Parsing into an AST / concrete predicates
     * is left to the host application or higher-level helpers.
     */
    filter?: string | null;
    orderBy?: ODataOrderBy[] | null;
    top?: number | null;
    skip?: number | null;
    count?: boolean | null;
    expand?: string[] | null;
}
/**
 * Minimal parsing helper for OData-like query parameters.
 *
 * It accepts a typical NestJS `@Query()` shape (record of strings/arrays) and
 * normalises it into `ODataQueryParams`. Validation is deliberately strict:
 * invalid numeric values or orderBy segments will result in an Error so the
 * caller can translate that into a 400 response.
 */
export declare function parseODataQueryParams(query: Record<string, unknown>): ODataQueryParams;
