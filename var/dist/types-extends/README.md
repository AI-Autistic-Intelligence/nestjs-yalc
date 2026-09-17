# @nest-yalc-2/types-extends

Additional ambient type extensions for applications that use the broader
YALC runtime stack.

This package extends `@nest-yalc-2/types` with global declarations for TypeORM
migration registration and selected environment variables.

## Installation

```bash
npm install --save-dev @nest-yalc-2/types-extends
```

## Main Exports

- Re-exports from `@nest-yalc-2/types`.
- Global TypeORM migration class registries.
- Environment variable declarations for logger and TypeORM options.

## Example

```ts
import '@nest-yalc-2/types-extends';

globalThis.TypeORM_Migration_classes = {
  default: [CreateUsersTable],
};
```
