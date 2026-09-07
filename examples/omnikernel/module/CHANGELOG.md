# @nest-yalc-2/omnikernel-module

## 1.1.0

### Minor Changes

- 2eef9de: Add generic boolean projection fields and Omni-owned extension and relation
  projection composition. Generated REST and GraphQL resources now support
  server-owned extension identities, bounded multi-kind relation semantics,
  transaction-aware lifecycle policies, bounded manager-bound readers, immutable
  versioned migration snapshots, reversible migration plans, and explicit
  consumer-owned `ModuleRef` injection tokens on SQLite and PostgreSQL.
- 8d3d378: Publish OmniKernel as a normal framework package and verify its complete
  runtime and type dependency closure from a standalone tarball consumer.

### Patch Changes

- Updated dependencies [2eef9de]
- Updated dependencies [8d3d378]
- Updated dependencies [d7b9575]
- Updated dependencies [b3b3597]
- Updated dependencies [ab50237]
- Updated dependencies [4363633]
  - @nest-yalc-2/crud-gen@1.5.0
  - @nest-yalc-2/event-manager@1.3.4
  - @nest-yalc-2/data-loader@1.3.4
  - @nest-yalc-2/graphql@1.3.4
  - @nest-yalc-2/utils@1.3.4
