import { type DynamicModule, Module } from '@nestjs/common';
import {
  OmniKernelModule,
  type OmniKernelRegistrationOptions,
} from '@nest-yalc-2/omnikernel-module';
import { omniApiControllers, omniApiProviders } from './omni-api.resources';

@Module({})
export class OmniApiModule {
  static register(
    registration: string | OmniKernelRegistrationOptions,
  ): DynamicModule {
    return {
      module: OmniApiModule,
      imports: [OmniKernelModule.register(registration)],
      controllers: omniApiControllers,
      providers: omniApiProviders,
    };
  }
}
