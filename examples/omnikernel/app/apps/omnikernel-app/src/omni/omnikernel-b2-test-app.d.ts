import { type DynamicModule } from '@nestjs/common';
export type OmniKernelB2Dialect = 'sqlite' | 'postgres';
export interface OmniKernelB2TestAppOptions {
    dialect: OmniKernelB2Dialect;
    postgresUrl?: string;
}
export declare class OmniKernelB2TestAppModule {
    static register(options: OmniKernelB2TestAppOptions): DynamicModule;
}
