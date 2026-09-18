---
id: crud-gen
title: CRUD Generator
sidebar_position: 2
---

# CRUD Generator

The `@nest-yalc-2/crud-gen` module is a powerful code generator that automates the creation of REST controllers and GraphQL resolvers based directly on your TypeORM entities.

## Installation

```bash
npm install @nest-yalc-2/crud-gen
```

## Features

- **Zero Boilerplate**: Define an entity, get a fully functioning API.
- **REST & GraphQL**: Generates both RESTful endpoints and GraphQL queries/mutations simultaneously.
- **Dynamic Filtering**: Built-in support for complex filtering, sorting, and pagination (Cursor & Offset based).
- **Security**: Easily integrate with guards to restrict access to specific CRUD operations.

## Basic Usage

The core of the CRUD generator relies on the `@CrudGenEntity` decorator.

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { CrudGenEntity } from '@nest-yalc-2/crud-gen';

@Entity('products')
@CrudGenEntity({
  routes: ['getMany', 'getOne', 'createOne', 'updateOne', 'deleteOne'],
})
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal')
  price: number;
}
```

### What happens under the hood?

When the application boots, `crud-gen` inspects entities decorated with `@CrudGenEntity`. It then dynamically constructs a NestJS Controller and/or GraphQL Resolver.

By default, for the `Product` entity above, it generates:
- `GET /products` (with query parameters for filtering)
- `GET /products/:id`
- `POST /products`
- `PATCH /products/:id`
- `DELETE /products/:id`

## Advanced Configuration

You can customize the generated endpoints, add specific DTOs, or restrict access using the decorator options.

```typescript
@CrudGenEntity({
  routes: ['getMany', 'getOne'], // Only expose Read operations
  dto: {
    create: CreateProductDto,
    update: UpdateProductDto,
  },
  guards: [JwtAuthGuard], // Secure all generated endpoints
})
export class Product { /* ... */ }
```

## Filtering and Pagination

The generated `getMany` endpoint automatically supports a rich filtering syntax.

Example Request:
`GET /products?filter[price][$gt]=100&sort[name]=ASC&limit=20&offset=0`

This is automatically translated into a TypeORM `QueryBuilder` execution, safely preventing SQL injection while providing maximum flexibility for frontend clients.
