export const headerWhitelist = ['Authorization'];
export function filterHeaders(headers, whitelist = headerWhitelist) {
    if (!headers) {
        return headers;
    }
    return Object.entries(headers)
        .filter(([key]) => whitelist.includes(key))
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
}
//# sourceMappingURL=header-whitelist.helper.js.map