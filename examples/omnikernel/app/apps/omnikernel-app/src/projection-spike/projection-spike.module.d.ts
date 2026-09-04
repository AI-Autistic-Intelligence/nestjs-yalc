import { type DynamicModule, type MiddlewareConsumer, type NestModule } from '@nestjs/common';
export type ProjectionSpikeDialect = 'sqlite' | 'postgres';
export interface ProjectionSpikeModuleOptions {
    dialect: ProjectionSpikeDialect;
    postgresUrl?: string;
}
export declare const PROJECTION_SPIKE_DIALECT: unique symbol;
export declare class ProjectionSpikeAppModule implements NestModule {
    static register(options: ProjectionSpikeModuleOptions): DynamicModule;
    configure(consumer: MiddlewareConsumer): void;
}
