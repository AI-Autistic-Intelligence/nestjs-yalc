<div align="center">
  <h1>@nest-yalc-2/kafka</h1>
  <p><em>Core enterprise module for the @nest-yalc-2/kafka integration within the Ferrox/YALC ecosystem.</em></p>
  
  [![npm version](https://badge.fury.io/js/%40nest-yalc-2%2Fkafka.svg)](https://badge.fury.io/js/%40nest-yalc-2%2Fkafka)
  [![License](https://img.shields.io/npm/l/%40nest-yalc-2%2Fkafka.svg)](https://github.com/AI-Autistic-Intelligence)
</div>

## 🚀 Installation

```bash
npm install @nest-yalc-2/kafka
# or
yarn add @nest-yalc-2/kafka
# or
pnpm add @nest-yalc-2/kafka
```

---

# 📬 KafkaJS & Schema Registry Integration (`@nest-yalc-2/kafka`)

`@nest-yalc-2/kafka` provides production-grade event streaming for NestJS 11+. It wraps **KafkaJS** and `@kafkajs/confluent-schema-registry`, enabling strongly-typed, schema-validated message producing and consuming across distributed microservices.

---

## 🌟 Key Features

- **Confluent Schema Registry Support**: Automatically serializes and deserializes message payloads using Avro, JSON Schema, or Protobuf schemas stored in Confluent Schema Registry.
- **Consumer Group Management**: Auto-rebalancing consumer group runners with exponential backoff retries and Dead Letter Queue (DLQ) routing.
- **Producer Connection Pool**: High-performance idempotent Kafka producer with message batching and snappy/gzip compression.
- **Trace Correlation Header Injection**: Automatically attaches `X-Request-Id` and OpenTelemetry `traceparent` headers into Kafka message headers.

---

## 🔬 Internal Architecture & Execution Mechanics

```mermaid
flowchart TD
    Producer["NestJS Microservice (Producer)"]
    SchemaReg["Confluent Schema Registry"]
    KafkaCluster["Kafka Cluster (Topic: order-events)"]
    ConsumerGroup["Consumer Group (order-consumer-group)"]
    DLQ["Dead Letter Queue (order-events-dlq)"]

    Producer -->|1. Fetch/Validate Schema| SchemaReg
    Producer -->|2. Produce Avro Message| KafkaCluster
    KafkaCluster --> ConsumerGroup
    ConsumerGroup -->|Processing Succeeded| CommitOffset["Commit Offset"]
    ConsumerGroup -->|Max Retries Failed| DLQ
```

---

## 📊 Architectural Comparison: `@nest-yalc-2/kafka` vs Standard NestJS Microservices

| Feature / Dimension | 📬 `@nest-yalc-2/kafka` | 🐢 NestJS Microservice Kafka Transport |
|---|---|---|
| **Confluent Schema Registry** | **Native Avro / JSON Schema Validation** | Not Supported (Raw Unvalidated JSON) |
| **Dead Letter Queue (DLQ)** | **Automated DLQ Router on Failures** | Manual Error Catching & Routing |
| **Trace Correlation** | **Automatic W3C Trace Parent Header Injection** | Manual Header Parsing |

---

## 🚀 Practical Usage & Production Code Examples

### 1. Registering Kafka Module in `AppModule`

```typescript
import { Module } from '@nestjs/common';
import { YalcKafkaModule } from '@nest-yalc-2/kafka';

@Module({
  imports: [
    YalcKafkaModule.forRoot({
      clientId: 'order-service',
      brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
      schemaRegistry: {
        host: process.env.SCHEMA_REGISTRY_URL || 'http://localhost:8081',
      },
      consumer: {
        groupId: 'order-processor-group',
      },
    }),
  ],
})
export class AppModule {}
```

### 2. Producing Schema-Validated Events

```typescript
import { Injectable } from '@nestjs/common';
import { YalcKafkaProducer } from '@nest-yalc-2/kafka';

@Injectable()
export class OrderEventPublisher {
  constructor(private readonly kafkaProducer: YalcKafkaProducer) {}

  async publishOrderCreated(orderId: string, amount: number): Promise<void> {
    await this.kafkaProducer.emit('order-events', {
      key: orderId,
      value: {
        orderId,
        amount,
        status: 'CREATED',
        timestamp: Date.now(),
      },
      schemaName: 'OrderCreatedEventSchema',
    });
  }
}
```

---

## ⚠️ Common Pitfalls & Anti-Patterns

> [!CAUTION]
> **Blocking the Kafka Consumer Event Loop**: Executing heavy synchronous computations or un-batched database queries inside a Kafka message handler will delay heartbeat responses (`session.timeout.ms`), causing Kafka to consider the consumer dead and trigger cascading rebalances.

---

## 💡 Best Practices

> [!TIP]
> **Idempotent Consumers**: Ensure consumer handlers check if an event ID has already been processed using Redis or an audit table to handle potential duplicate message deliveries gracefully.


---

## 🔗 Cross-References

To see how this module integrates with the rest of the Ferrox architecture, refer to the following documentation:

- [Database & TypeORM](https://ferrox-rust.dev/docs/nestjs-yalc/databases/database)
- [Event Manager](https://ferrox-rust.dev/docs/nestjs-yalc/node-yalc/docs/architectures/event-manager)
- [Node-YALC Errors](https://ferrox-rust.dev/docs/nestjs-yalc/node-yalc/docs/fundamentals/errors)


---
## 📚 Ecosystem Documentation

This module is a core component of the Ferrox enterprise microservice architecture. 

👉 **[Read the Full Documentation on Ferrox-Rust.dev](https://ferrox-rust.dev/docs/nestjs-yalc/integrations/kafka)**
