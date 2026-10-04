export const headerWhitelist = ['Authorization'];

export function filterHeaders(
  headers: Record<string, string> | undefined,
  whitelist: string[] = headerWhitelist,
) {
  if (!headers) {
    return headers;
  }
  return Object.entries(headers)
    .filter(([key]) => whitelist.includes(key))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
}
