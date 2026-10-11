import { Provider } from '@nestjs/common';

export function isProviderObject(obj: unknown): obj is Provider {
  return obj !== null && typeof obj === 'object' && 'provide' in obj;
}
