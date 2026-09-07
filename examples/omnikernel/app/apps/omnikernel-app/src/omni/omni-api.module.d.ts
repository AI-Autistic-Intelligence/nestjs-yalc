import { type DynamicModule } from '@nestjs/common';
import { type OmniKernelRegistrationOptions } from '@nest-yalc-2/omnikernel-module';
export declare class OmniApiModule {
    static register(registration: string | OmniKernelRegistrationOptions): DynamicModule;
}
