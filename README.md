# 🪺 NestJS-YALC (`@nest-yalc-2/framework`)

<p align="center">
  <b>Enterprise Monorepo Infrastructure & Production Extension Suite for NestJS 11+</b><br/>
  <i>Surpassing Standard NestJS Boilerplate with Automated TypeORM CRUD Generation, $\mathcal{O}(1)$ GraphQL DataLoader Batching, OpenTelemetry Tracing, and Sentinel Security.</i>
</p>

<p align="center">
  <a href="https://opensource.org/licenses/AGPL-3.0"><img src="https://img.shields.io/badge/License-AGPL--3.0-blue.svg" alt="License: AGPL-3.0" /></a>
  <a href="https://nestjs.com/"><img src="https://img.shields.io/badge/NestJS-11.x-red.svg" alt="NestJS 11" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-6.0%2B-blue.svg" alt="TypeScript 6" /></a>
  <a href="https://graphql.org/"><img src="https://img.shields.io/badge/GraphQL-Apollo%20%2F%20Mercurius-magenta.svg" alt="GraphQL Apollo Mercurius" /></a>
  <a href="https://kafka.apache.org/"><img src="https://img.shields.io/badge/Messaging-KafkaJS-black.svg" alt="KafkaJS" /></a>
  <a href="https://opentelemetry.io/"><img src="https://img.shields.io/badge/Telemetry-OpenTelemetry%20%2B%20Sentry-purple.svg" alt="OpenTelemetry Sentry" /></a>
</p>

<p align="center">
  <a href="#-1-executive-summary--architectural-rationale">Philosophy</a> •
  <a href="#-2-architectural-comparison-nestjs-yalc-vs-standard-nestjs">Comparison Matrix</a> •
  <a href="#-3-core-performance-innovations--mechanics">Performance Mechanics</a> •
  <a href="#-4-request--module-execution-pipeline">Execution Pipeline</a> •
  <a href="#-5-exhaustive-16-package-inventory--code-examples">16 Packages & Code</a> •
  <a href="#-6-end-to-end-production-code-walkthrough">Code Walkthrough</a> •
  <a href="#-7-testing-suite--ci-cd-pipeline">Testing Pipeline</a>
</p>

---

## 🎯 1. Executive Summary & Architectural Rationale

While **NestJS** popularized a structured, modular architecture for enterprise Node.js applications, building and scaling enterprise monorepos using standard NestJS introduces significant development overhead and performance bottlenecks:

1. **Repetitive CRUD Boilerplate**: Developers spend up to 40% of their time writing repetitive REST controllers, GraphQL resolvers, services, DTO filter objects, and TypeORM query builders for standard database entities.
2. **GraphQL N+1 Query Degradation**: In GraphQL APIs, resolving nested entity relationships (e.g. `User -> Posts -> Comments`) triggers the N+1 query problem, converting a single client HTTP request into hundreds of quadratic database queries ($\mathcal{O}(N \cdot M)$).
3. **Fragmented Tracing & Telemetry**: Linking Pino contextual loggers, HTTP `X-Request-Id` headers, OpenTelemetry OTLP traces, and Sentry error captures across microservices requires fragile custom interceptors.

### **NestJS-YALC solves these problems with zero-boilerplate production modules.**

Nest-YALC stands for **NestJS - Yet Another Library Collection**. It provides a 100% modular infrastructure framework (`@nest-yalc-2/*`) for NestJS 11+, integrating pure shared core utilities from `@node-yalc` (via Git Submodule) into high-performance NestJS Dynamic Modules, Interceptors, and Decorators.

---

## 📊 2. Architectural Comparison: NestJS-YALC vs Standard NestJS

| Feature / Dimension | 🪺 NestJS-YALC (`@nest-yalc-2/*`) | 🪺 Standard NestJS Monorepo | 🍃 Spring Boot (Java) |
|---|---|---|---|
| **CRUD Generation** | **Zero-Boilerplate (`@CrudGenEntity`)** | Manual Controller & Service | Spring Data REST (Limited) |
| **GraphQL N+1 Batching** | **Automated DataLoader Field Middleware ($\mathcal{O}(1)$)** | Manual `DataLoader` per Resolver | Manual DGS DataFetcher |
| **Request Context Logging** | **Pino Async Local Storage + Trace ID** | Basic Nest Logger / Manual Setup | MDC Context Logging |
| **Entity Mutation Auditing** | **Automatic Revision Loggers (`@nest-yalc-2/audit`)** | Manual Entity Listeners | Envers (Hibernate) |
| **Schema Registry Messaging** | **KafkaJS + Confluent Schema Registry** | Basic Microservice Transports | Spring Kafka |
| **Distributed Telemetry** | **Native OpenTelemetry OTLP + Sentry** | Requires Custom Interceptors | Spring Cloud Sleuth |

---

## 📦 5. Exhaustive 16-Package Inventory & Code Examples

### 1. `app` (`@nest-yalc-2/app`)
```typescript
import { YalcAppModule } from '@nest-yalc-2/app';
// Handles graceful shutdown and env config loading
```

### 2. `audit` (`@nest-yalc-2/audit`)
```typescript
import { AuditService } from '@nest-yalc-2/audit';
// Automatically logs entity mutations to audit revision table
```

### 3. `crud-gen` (`@nest-yalc-2/crud-gen`)
```typescript
import { CrudGenEntity } from '@nest-yalc-2/crud-gen';
@CrudGenEntity({ routes: ['getMany', 'getOne', 'createOne'] })
export class Product {}
```

### 4. `api-strategy` (`@nest-yalc-2/api-strategy`)
Adapts REST, GraphQL, and RPC microservice controllers to uniform request context.

### 5. `data-loader` (`@nest-yalc-2/data-loader`)
```typescript
import { YalcDataLoaderInterceptor } from '@nest-yalc-2/data-loader';
// Solves N+1 query problem automatically across GraphQL field resolvers
```

### 6. `database` (`@nest-yalc-2/database`)
```typescript
import { YalcDatabaseModule } from '@nest-yalc-2/database';
YalcDatabaseModule.forRoot({ type: 'mysql', database: 'prod_db' });
```

### 7. `errors` (`@nest-yalc-2/errors`)
Maps `@node-yalc/errors` to standard NestJS Exception Filters.

### 8. `event-manager` (`@nest-yalc-2/event-manager`)
NestJS EventEmitter2 and distributed message bus.

### 9. `field-middleware` (`@nest-yalc-2/field-middleware`)
GraphQL field authorization and sanitization middleware.

### 10. `graphql` (`@nest-yalc-2/graphql`)
Apollo and Mercurius GraphQL dynamic server setup.

### 11. `jest` (`@nest-yalc-2/jest`)
Multi-project Jest test runner and coverage server.

### 12. `kafka` (`@nest-yalc-2/kafka`)
KafkaJS with Confluent Schema Registry support.

### 13. `logger` (`@nest-yalc-2/logger`)
Pino contextual logger with HTTP request ID correlation.

### 14. `observability` (`@nest-yalc-2/observability`)
OpenTelemetry OTLP tracing and Sentry error captures.

### 15. `sentinel` (`@nest-yalc-2/sentinel`)
Security middleware enforcing OWASP headers and payload bounds.

### 16. `utils` (`@nest-yalc-2/utils`)
NestJS transformation pipes, interceptors, and helper decorators.

---

## 💻 6. End-to-End Production Code Walkthrough

```typescript
import { Module } from '@nestjs/common';
import { YalcAppModule } from '@nest-yalc-2/app';
import { YalcLoggerModule } from '@nest-yalc-2/logger';
import { YalcDatabaseModule } from '@nest-yalc-2/database';
import { YalcObservabilityModule } from '@nest-yalc-2/observability';

@Module({
  imports: [
    YalcLoggerModule.forRoot({ pinoOptions: { level: 'info' } }),
    YalcObservabilityModule.forRoot({ serviceName: 'user-service' }),
    YalcDatabaseModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      database: 'enterprise_db',
    }),
  ],
})
export class AppModule {}
```

---

## 📜 License

AGPL-3.0-or-later © AI Autistic Intelligence Team
