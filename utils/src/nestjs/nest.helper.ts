export function isProviderObject(provider: any): boolean {
  return (
    typeof provider === 'object' && provider !== null && 'provide' in provider
  );
}
