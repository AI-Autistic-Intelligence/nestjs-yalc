import type { INestApplication } from '@nestjs/common';
import { type ProjectionSpikeModuleOptions } from './projection-spike.module';
export type ProjectionSpikeDialect = ProjectionSpikeModuleOptions['dialect'];
export declare function createProjectionSpikeTestApp(options: ProjectionSpikeModuleOptions): Promise<INestApplication>;
