import { DynamicModule } from '@nestjs/common';
import { type OmniKernelRegistrationOptions } from './omni-scope.js';
export declare class OmniKernelModule {
    static register(registration: string | OmniKernelRegistrationOptions): DynamicModule;
}
