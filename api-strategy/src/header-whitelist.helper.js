export const headerWhitelist = ['Authorization'];
export function filterHeaders(headers, whitelist = headerWhitelist) {
    return headers
        ? Object.entries(headers)
            .filter(([key]) => whitelist.includes(key))
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
        : headers;
}
//# sourceMappingURL=header-whitelist.helper.js.map