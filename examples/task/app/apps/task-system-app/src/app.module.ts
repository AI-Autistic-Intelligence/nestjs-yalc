import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '@nest-yalc-2/errors/filters/http-exception.filter.js';
import { AppLoggerFactory } from '@nest-yalc-2/logger';
import { GraphQLModule } from '@nestjs/graphql';
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MutationJournalModule } from '@nest-yalc-2/audit';
import { UUIDScalar } from '@nest-yalc-2/graphql/scalars/uuid.scalar';
import {
  OmniCollectionEntity,
  OmniDocumentEntity,
  OmniExternalRefEntity,
  OmniNamedEntity,
  OmniRecordEntity,
  OmniRelationEntity,
} from '@nest-yalc-2/omnikernel-module';
import {
  ObservabilityModule,
  createObservabilityOptionsFromEnv,
} from '@nest-yalc-2/observability';
import { EventsModule } from './events/events.module';
import {
  TaskEventRelationsResolver,
  TaskItemRelationsResolver,
  TaskProjectRelationsResolver,
} from './graphql-relations.resolver';
import { OmniTaskAppModule } from './omni-task-app/omni-task-app.module';
import { ProjectsModule } from './projects/projects.module';
import { SyncModule } from './sync/sync.module';
import { TaskSyncStateProjection } from './sync/task-sync-state.projection';
import { TasksModule } from './tasks/tasks.module';
import { TaskAppEventModule } from './task-app-event.module';

@Module({
  imports: [
    GraphQLModule.forRoot<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      autoSchemaFile: true,
      path: '/graphql',
    }),
    TaskAppEventModule,
    ObservabilityModule.forRoot(() =>
      createObservabilityOptionsFromEnv('task-system-app'),
    ),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [
        OmniNamedEntity,
        OmniRecordEntity,
        OmniRelationEntity,
        OmniCollectionEntity,
        OmniDocumentEntity,
        OmniExternalRefEntity,
        TaskSyncStateProjection,
      ],
      synchronize: true,
    }),
    MutationJournalModule.forRoot({
      enabled: process.env.MUTATION_JOURNAL_ENABLED !== 'false',
      retentionDays: Number(process.env.MUTATION_JOURNAL_RETENTION_DAYS ?? 30),
    }),
    OmniTaskAppModule,
    TasksModule,
    ProjectsModule,
    EventsModule,
    SyncModule,
  ],
  providers: [
    UUIDScalar,
    TaskItemRelationsResolver,
    TaskEventRelationsResolver,
    TaskProjectRelationsResolver,
    {
      provide: APP_FILTER,
      useFactory: () => new HttpExceptionFilter(AppLoggerFactory('TaskSystemApp')),
    },
  ],
})
export class AppModule {}
