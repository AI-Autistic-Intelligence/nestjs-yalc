---
id: data-loader
title: "@nest-yalc-2/data-loader"
sidebar_position: 2
---

# 🚀 Automated GraphQL DataLoader Batching (`@nest-yalc-2/data-loader`)

## 💡 1. What It Is & Architectural Purpose
`@nest-yalc-2/data-loader` is the automated query optimization module for GraphQL APIs in NestJS. It eliminates the **N+1 query problem** at the root, reducing database query complexity from quadratic ($\mathcal{O}(N \cdot M)$) to constant ($\mathcal{O}(1)$).

---

## ⚙️ 2. What It Does & Key Features
- **Automated Relational Field Batching**: Collects all entity IDs requested by nested GraphQL field resolvers during the same Event Loop tick and groups them into a single SQL `WHERE IN (...)` query.
- **In-Memory Request Caching**: Temporarily caches results during the lifecycle of a single HTTP/GraphQL request to prevent duplicate database queries.
- **Transparent Integration**: Requires no manual `DataLoader` instantiation inside individual resolver files.

---

## 🔬 3. How It Works Under the Hood

### Query Complexity Reduction

```
 Client GraphQL Query: 1 User with 100 correlated Posts
 ----------------------------------------------------
 Without DataLoader: 1 Query for User + 100 SQL Queries for each Post = 101 DB Queries! (O(N))
 With DataLoader:    1 Query for User + 1 Batched SQL Query (WHERE id IN (...)) = 2 DB Queries! (O(1))
```

1. **Tick Collector**: When Apollo or Mercurius resolves the `posts` field for 100 users, `YalcDataLoaderInterceptor` intercepts calls, deferring execution to the microtask queue tick end.
2. **Bulk Fetch**: Executes a single database query: `SELECT * FROM posts WHERE userId IN ('u1', 'u2', ..., 'u100')`.
3. **Map Dispatch**: Distributes returned entities back to individual GraphQL field nodes in memory.

---

## 🧠 4. Why It Was Designed This Way (Automatic Interceptor vs Manual DataLoader)

| Feature | 🚀 `@nest-yalc-2/data-loader` | 🐢 Manual DataLoader |
|---|---|---|
| **Resolver Setup** | **1 Decorator (`@UseInterceptors(YalcDataLoaderInterceptor)`)** | Manual `DataLoader` creation in GraphQL Context per Request |
| **Database Complexity** | **$\mathcal{O}(1)$ Constant** | $\mathcal{O}(N \cdot M)$ Quadratic (If developer forgets) |
| **Maintainability** | **Zero Boilerplate** | Dozens of manual loaders to maintain |

---

## 🚀 5. Practical Usage Guide & Extended Code Examples

```typescript
import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { UseInterceptors } from '@nestjs/common';
import { YalcDataLoaderInterceptor } from '@nest-yalc-2/data-loader';

@Resolver(() => User)
@UseInterceptors(YalcDataLoaderInterceptor)
export class UserResolver {
  @ResolveField(() => [Post])
  async posts(@Parent() user: User) {
    // Intercepted and batched automatically by YalcDataLoaderInterceptor!
    return user.posts;
  }
}
```

---

## ⚠️ 6. Anti-Patterns: How NOT to Use It

1. ❌ **DO NOT use DataLoader as a persistent global cache**: DataLoader is scoped strictly to the lifecycle of a single HTTP/GraphQL request. Sharing DataLoader instances across separate requests causes stale data reads.

---

## 💡 7. Pro-Tips & Best Practices

> [!TIP]
> **OpenTelemetry Tracing**: `@nest-yalc-2/data-loader` emits dedicated OpenTelemetry spans showing exactly how many SQL queries were saved during GraphQL query resolution.
