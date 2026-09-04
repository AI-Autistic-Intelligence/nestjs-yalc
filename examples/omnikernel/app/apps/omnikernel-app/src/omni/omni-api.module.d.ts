import { type DynamicModule } from '@nestjs/common';
import { type OmniKernelRegistrationOptions } from '@nestjs-yalc/omnikernel-module';
export declare class OmniApiModule {
    static register(registration: string | OmniKernelRegistrationOptions): DynamicModule;
}
