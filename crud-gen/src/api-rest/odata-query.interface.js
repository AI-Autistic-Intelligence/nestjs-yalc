"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseODataQueryParams = parseODataQueryParams;
function parseODataQueryParams(query) {
    const get = (key) => {
        var _a;
        const value = query[key];
        if (value === undefined || value === null)
            return undefined;
        if (Array.isArray(value)) {
            return String((_a = value[0]) !== null && _a !== void 0 ? _a : '').trim() || undefined;
        }
        const str = String(value).trim();
        return str.length ? str : undefined;
    };
    const selectRaw = get('$select');
    const filterRaw = get('$filter');
    const orderByRaw = get('$orderby');
    const topRaw = get('$top');
    const skipRaw = get('$skip');
    const countRaw = get('$count');
    const expandRaw = get('$expand');
    const params = {};
    if (selectRaw) {
        params.select = selectRaw
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
    }
    if (filterRaw) {
        params.filter = filterRaw;
    }
    if (orderByRaw) {
        const segments = orderByRaw
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        const parsed = segments.map((segment) => {
            const [fieldRaw, dirRaw] = segment.split(/\s+/).filter(Boolean);
            if (!fieldRaw) {
                throw new Error(`Invalid $orderby segment: "${segment}"`);
            }
            const direction = dirRaw && dirRaw.toLowerCase() === 'desc' ? 'desc' : 'asc';
            return { field: fieldRaw, direction };
        });
        if (parsed.length) {
            params.orderBy = parsed;
        }
    }
    if (topRaw !== undefined) {
        const top = Number(topRaw);
        if (!Number.isInteger(top) || top < 1) {
            throw new Error(`Invalid $top value: "${topRaw}"`);
        }
        params.top = top;
    }
    if (skipRaw !== undefined) {
        const skip = Number(skipRaw);
        if (!Number.isInteger(skip) || skip < 0) {
            throw new Error(`Invalid $skip value: "${skipRaw}"`);
        }
        params.skip = skip;
    }
    if (countRaw !== undefined) {
        const normalized = countRaw.toLowerCase();
        params.count = normalized === 'true';
    }
    if (expandRaw) {
        params.expand = expandRaw
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
    }
    return params;
}
//# sourceMappingURL=odata-query.interface.js.map