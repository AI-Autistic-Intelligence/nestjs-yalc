import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { type DataSource } from 'typeorm';
import {
  applyProjectionIndexesForBootstrap,
  type ProjectionDialect,
} from '@nest-yalc-2/crud-gen';
import { HttpExceptionFilter } from '@nest-yalc-2/errors/filters/http-exception.filter.js';
import { AppLoggerFactory } from '@node-yalc/logger';
import { projectionRecordDefinition } from './projection-spike.definition';
import {
  PROJECTION_SPIKE_DIALECT,
  ProjectionSpikeAppModule,
  type ProjectionSpikeModuleOptions,
} from './projection-spike.module';

export type ProjectionSpikeDialect = ProjectionSpikeModuleOptions['dialect'];

export async function createProjectionSpikeTestApp(
  options: ProjectionSpikeModuleOptions,
): Promise<INestApplication> {
  const moduleFixture = await Test.createTestingModule({
    imports: [ProjectionSpikeAppModule.register(options)],
  }).compile();
  const app = moduleFixture.createNestApplication();
  app.useGlobalFilters(
    new HttpExceptionFilter(AppLoggerFactory('ProjectionSpikeApp')),
  );
  await app.init();
  await applyProjectionIndexesForBootstrap(
    app.get<DataSource>(getDataSourceToken()),
    app.get<ProjectionDialect>(PROJECTION_SPIKE_DIALECT),
    projectionRecordDefinition,
  );
  return app;
}
