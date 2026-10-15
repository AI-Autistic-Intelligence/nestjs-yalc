# Enterprise Reference Showcase & Didactic Learning Path

This directory hosts the progressive reference architecture for `@nestjs-yalc`. These examples are structured as a 3-tier didactic curriculum: each example builds upon the architectural capabilities of the previous one.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        LEARNING CURRICULUM                             │
│                                                                        │
│   LEVEL 1: Skeleton (Base CRUD & Rapid Prototyping)                    │
│   └── Base CrudGen, DTOs, SQLite In-Memory, Error Handling RFC 7807   │
│                                                                        │
│   LEVEL 2: OmniKernel (Persistence & Contracts)                        │
│   └── Reusable Persistence Substrate, Portable Documents, Scope Auth   │
│                                                                        │
│   LEVEL 3: Task System (Distributed Enterprise Microservice)          │
│   └── CQRS, RabbitMQ Messaging, Projections, Observability & Auditing │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Level 1: Skeleton (`examples/skeleton`)
- **Focus**: Minimum viable enterprise CRUD microservice.
- **Key Concepts**:
  - `CrudGenResourceFactory`: Automated REST controller & GraphQL resolver synthesis from TypeORM entities and NestJS DTOs.
  - In-memory SQLite runtime with zero external infrastructure dependencies.
  - RFC 7807 Problem Details and structured error translation through `@nest-yalc-2/errors`.
  - Type-safe event dispatching via `YalcEventService`.
- **Reference Doc**: [Skeleton README](file:///C:/Users/nn/Desktop/code/nestjs-yalc/examples/skeleton/README.md)
- **Run Tests**:
  ```bash
  npm run test:e2e --prefix examples/skeleton/app
  ```

---

## 2. Level 2: OmniKernel (`examples/omnikernel`)
- **Focus**: Reusable multi-tenant persistence substrate and schema contracts.
- **Key Concepts**:
  - Decoupling of domain schemas from raw relational storage using portable document entities (`OmniCollection`, `OmniDocument`, `OmniRecord`, `OmniRelation`, `OmniExternalRef`).
  - Request-scoped boundary isolation (`scopeId`) enforced at the database driver level.
  - Polymorphic relations and GraphQL federation / Dataloader projections.
- **Reference Doc**: [OmniKernel README](file:///C:/Users/nn/Desktop/code/nestjs-yalc/examples/omnikernel/README.md)
- **Run Tests**:
  ```bash
  npm run test:e2e --prefix examples/omnikernel/app
  ```

---

## 3. Level 3: Task System (`examples/task`)
- **Focus**: Production-ready distributed event-driven microservice.
- **Key Concepts**:
  - **CQRS & Projections**: Write-side transactions paired with read-optimized materialized sync state projections (`TaskSyncStateProjection`).
  - **Asynchronous Messaging**: RabbitMQ broker integration for domain event propagation and cross-service orchestration.
  - **Observability**: Distributed OpenTelemetry tracing (W3C Trace Context) and Prometheus metrics integration.
  - **Mutation Journaling**: Database triggers and temporal audit ledger (`MutationJournalModule`) for compliance.
- **Reference Doc**: [Task System README](file:///C:/Users/nn/Desktop/code/nestjs-yalc/examples/task/README.md)
- **Run Tests**:
  ```bash
  npm run test:e2e --prefix examples/task/app
  ```

---

## Shared Infrastructure (`docker-compose.all.yml`)

To start the shared backing services (PostgreSQL 16, RabbitMQ 3.13 with Management, and OpenTelemetry Collector) for running all 3 applications simultaneously:

```bash
docker compose -f docker-compose.all.yml up -d
```

### Infrastructure Endpoints
| Service | Internal Port | Host Port | Credentials | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **PostgreSQL** | `5432` | `5432` | `postgres` / `postgres` (DB: `yalc_enterprise`) | Relational persistence |
| **RabbitMQ** | `5672` | `5672` | `guest` / `guest` | AMQP 0-9-1 Message Broker |
| **RabbitMQ UI** | `15672` | `15672` | `guest` / `guest` | Management Console |
| **OTel Collector (gRPC)** | `4317` | `4317` | N/A | OpenTelemetry Traces & Metrics |
| **OTel Collector (HTTP)** | `4318` | `4318` | N/A | OpenTelemetry OTLP/HTTP |
| **Prometheus Exporter** | `8889` | `8889` | N/A | Prometheus Scrape Target |
