---
id: quickstart
title: Quickstart & First Application Setup
sidebar_position: 2
---

# Quickstart & First Application Setup

This step-by-step guide walks you through setting up a complete enterprise NestJS microservice from scratch using the **NestJS-YALC** monorepo toolkit.

---

## 1. Prerequisites

Before getting started, ensure your environment meets the following requirements:
- **Node.js**: `v18.x` or `v20.x` (LTS recommended)
- **Package Manager**: `npm` (v9+) or `pnpm`
- **Database**: PostgreSQL (v14+) or MySQL (v8+)
- **Message Broker**: Apache Kafka (optional, for event-driven modules)

---

## 2. Installation

Install the core NestJS-YALC packages into your NestJS project:

```bash
# Core Application & Logging Framework
npm install @nestjs-yalc/app @nestjs-yalc/logger @nestjs-yalc/errors @nestjs-yalc/utils

# Database & CRUD Generation
npm install @nestjs-yalc/database @nestjs-yalc/crud-gen @nestjs-yalc/ag-grid

# Security & Observability
npm install @nestjs-yalc/sentinel @nestjs-yalc/observability
```

---

## 3. Step 1: Define the Database Entity

Create a TypeORM domain entity representing your database table (`src/user/user.entity.ts`):

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

---

## 4. Step 2: Configure the NestJS Module

Wire up `YalcAppModule`, `DatabaseModule`, and `LoggerModule` inside `src/app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { YalcAppModule } from '@nestjs-yalc/app';
import { LoggerModule } from '@nestjs-yalc/logger';
import { DatabaseModule } from '@nestjs-yalc/database';
import { UserEntity } from './user/user.entity';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';

@Module({
  imports: [
    YalcAppModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule.forRoot({
      serviceName: 'user-service',
      level: 'debug',
    }),
    DatabaseModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'user_db',
      entities: [UserEntity],
      synchronize: true, // Set false in production
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
```

---

## 5. Step 3: Implement Service with AG-Grid Support

Create `src/user/user.service.ts` using `AgGridQueryTransformer`:

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgGridQueryTransformer, IServerSideGetRowsRequest } from '@nestjs-yalc/ag-grid';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getPaginatedUsers(gridRequest: IServerSideGetRowsRequest) {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    const transformer = new AgGridQueryTransformer<UserEntity>(queryBuilder, gridRequest, {
      id: 'user.id',
      email: 'user.email',
      firstName: 'user.firstName',
      lastName: 'user.lastName',
      status: 'user.status',
      createdAt: 'user.createdAt',
    });

    const [rows, totalCount] = await transformer.execute();

    return {
      rows,
      lastRow: totalCount,
    };
  }
}
```

---

## 6. Step 4: Create Controller with Unified Response Envelopes

Create `src/user/user.controller.ts`:

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { ResponseEnvelope } from '@nestjs-yalc/api-strategy';
import { IServerSideGetRowsRequest } from '@nestjs-yalc/ag-grid';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('grid')
  async getUsersGrid(@Body() gridRequest: IServerSideGetRowsRequest) {
    const result = await this.userService.getPaginatedUsers(gridRequest);
    return ResponseEnvelope.success(result.rows, { total: result.lastRow });
  }
}
```

---

## 7. Step 5: Bootstrap Application in `main.ts`

Bootstrap the application using `YalcApplicationFactory` in `src/main.ts`:

```typescript
import { YalcApplicationFactory } from '@nestjs-yalc/app';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await YalcApplicationFactory.create(AppModule, {
    appName: 'user-service',
    port: 3000,
    swagger: {
      enabled: true,
      path: '/docs',
      title: 'User Microservice API',
      version: '1.0.0',
    },
  });

  await app.listen();
  console.log('User Microservice running at http://localhost:3000');
}

bootstrap();
```

---

## 8. Verification

Run your application:

```bash
npm run start:dev
```

Send a test AG-Grid request to check server-side filtering and unified response wrapping:

```bash
curl -X POST http://localhost:3000/users/grid \
  -H "Content-Type: application/json" \
  -d '{
    "startRow": 0,
    "endRow": 10,
    "sortModel": [{"colId": "createdAt", "sort": "desc"}],
    "filterModel": {"status": {"filterType": "text", "type": "equals", "filter": "active"}}
  }'
```

Output:

```json
{
  "statusCode": 200,
  "success": true,
  "data": [ ... ],
  "meta": {
    "total": 1
  }
}
```
