# @nest-yalc-2/event-manager

## 1.3.4

### Patch Changes

- 8d3d378: Publish OmniKernel as a normal framework package and verify its complete
  runtime and type dependency closure from a standalone tarball consumer.
- ab50237: Declare the complete runtime dependency and peer graph reached by a standalone
  CrudGen installation. This lets consumers install `@nest-yalc-2/crud-gen`
  directly without relying on the aggregate framework package to hoist missing
  dependencies.
- Updated dependencies [ab50237]
  - @nest-yalc-2/errors@1.3.4
  - @nest-yalc-2/logger@1.3.4
  - @nest-yalc-2/utils@1.3.4

## 1.3.3

### Patch Changes

- Publish npm-safe README files for every package and prevent Jekyll landing-page
  markup from being copied into npm tarballs.
