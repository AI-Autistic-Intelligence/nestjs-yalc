---
id: overview
title: Overview
sidebar_position: 1
---

# NestJS-YALC Overview

**NestJS-YALC** (Yet Another Library Collection) is an enterprise-grade library suite designed specifically for NestJS 11+ and TypeScript 6+. It extends the core NestJS framework with a collection of pre-built, production-ready modules that address the most common and complex challenges in enterprise backend development.

## Philosophy

While NestJS provides an excellent architectural foundation, enterprise applications often require significant boilerplate to integrate advanced logging, tracing, auto-generated CRUD APIs, and Kafka messaging. NestJS-YALC bridges this gap by providing an opinionated, modular infrastructure.

The core tenets of NestJS-YALC are:

1. **Modularity First**: Every feature is encapsulated in a dedicated NestJS Module. You only import what you need.
2. **Enterprise Ready**: Built-in support for OpenTelemetry, Pino-based correlated logging, and Confluent Schema Registry.
3. **Developer Productivity**: Drastically reduces boilerplate through automated TypeORM CRUD generation (`crud-gen`) and GraphQL DataLoader batching.
4. **Git Submodule Core**: Leverages [`@node-yalc`](/docs/node-yalc/overview) as a pure Git submodule for base core utilities, wrapping them into native NestJS `Injectable()` providers.

## Key Features

- 🛠️ **Automated CRUD (`@nest-yalc-2/crud-gen`)**: Automatically generate TypeORM REST endpoints and GraphQL resolvers with advanced dynamic filtering.
- 📦 **GraphQL DataLoader (`@nest-yalc-2/data-loader`)**: Solve the N+1 query problem out-of-the-box with automated field batching.
- 📊 **Observability (`@nest-yalc-2/observability`)**: Seamless OpenTelemetry tracing, Prometheus metrics exporter, and Sentry exception reporting.
- 🗄️ **Database Enhancements (`@nest-yalc-2/database`)**: TypeORM database connection factories, transactional repository runners, and sophisticated seeding helpers.
- 📬 **Event Driven (`@nest-yalc-2/kafka` & `@nest-yalc-2/event-manager`)**: KafkaJS client integration with schema registry, and distributed event bus modules with typed payloads.
- 🔐 **Security Sentinel (`@nest-yalc-2/sentinel`)**: Security middleware enforcing HTTP headers, CORS policies, and payload sanitization.

## Getting Started

To begin using NestJS-YALC in your application, you typically start by importing the core lifecycle and logger modules into your root `AppModule`:

```typescript
import { Module } from '@nestjs/common';
import { YalcAppModule } from '@nest-yalc-2/app';
import { YalcLoggerModule } from '@nest-yalc-2/logger';

@Module({
  imports: [
    YalcAppModule.forRoot(),
    YalcLoggerModule.forRoot({
      pinoOptions: { level: 'info' }
    }),
  ],
})
export class AppModule {}
```

Explore the specific modules in the sidebar to understand how to leverage the full power of the YALC ecosystem.
