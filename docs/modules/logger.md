---
id: logger
title: Logger
sidebar_position: 1
---

# Logger Module

The `@nest-yalc-2/logger` module provides a high-performance, Pino-based logging infrastructure for NestJS applications. It automatically correlates HTTP requests, Redacts sensitive information, and integrates seamlessly with OpenTelemetry for distributed tracing.

## Installation

```bash
npm install @nest-yalc-2/logger
```

## Features

- **Pino Under the Hood**: Uses `pino` for extremely fast, JSON-formatted logging.
- **Request Correlation**: Automatically attaches request IDs and trace IDs to every log line within an HTTP request context.
- **Data Redaction**: Built-in support for removing sensitive fields (like passwords, credit cards) before they hit the stdout.
- **Global Replacement**: Safely replaces the default NestJS console logger during bootstrap and app execution.

## Usage

### 1. Bootstrapping

To ensure even the earliest NestJS bootstrap messages are logged using Pino, instantiate the logger before calling `NestFactory.create`:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createYalcLogger } from '@nest-yalc-2/logger';

async function bootstrap() {
  const logger = createYalcLogger({ level: 'debug' });
  
  const app = await NestFactory.create(AppModule, {
    logger: logger,
  });
  
  await app.listen(3000);
}
bootstrap();
```

### 2. Module Registration

Register the module in your `AppModule` to enable dependency injection of the logger across your application.

```typescript
import { Module } from '@nestjs/common';
import { YalcLoggerModule } from '@nest-yalc-2/logger';

@Module({
  imports: [
    YalcLoggerModule.forRoot({
      pinoOptions: {
        level: process.env.LOG_LEVEL || 'info',
        redact: ['req.headers.authorization', 'body.password'],
      }
    }),
  ],
})
export class AppModule {}
```

### 3. Injecting the Logger

You can now inject the logger into any provider.

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { YalcLoggerService } from '@nest-yalc-2/logger';

@Injectable()
export class UsersService {
  constructor(private readonly logger: YalcLoggerService) {}

  async createUser(data: any) {
    this.logger.log('Creating a new user', { email: data.email });
    // ...
  }
}
```

## Request Tracing

When combined with `@nest-yalc-2/observability`, the logger automatically captures OpenTelemetry Trace IDs and Span IDs. This means every log entry generated during a request will contain `trace_id`, making it trivial to search logs in systems like Datadog, ELK, or Grafana Loki.
