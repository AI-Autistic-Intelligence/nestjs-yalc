import { type InjectionToken, type Provider } from '@nestjs/common';
import { getProviderToken } from '@nest-yalc-2/crud-gen/crud-gen.helpers.js';
import { type GenericService } from '@nest-yalc-2/crud-gen/typeorm/generic.service.js';
import type { ClassType } from '@nest-yalc-2/types/globals.d.js';
import type { ObjectLiteral } from 'typeorm';
import type { GenericTypeORMRepository } from '@nest-yalc-2/crud-gen/typeorm/generic.repository.js';
import { OmniScopeContext, normalizeOmniKernelRegistrationOptions } from './omni-scope.js';
export interface OmniScopedBackendFactoryOptions<Entity extends ObjectLiteral> {
    entityModel: ClassType<Entity>;
    dbConnection: string;
    serviceToken?: string;
    serviceProvider?: InjectionToken;
    additionalInject?: readonly InjectionToken[];
    createService: (repository: GenericTypeORMRepository<Entity>, scope: OmniScopeContext, options: ReturnType<typeof normalizeOmniKernelRegistrationOptions>, ...additionalDependencies: unknown[]) => GenericService<Entity>;
}
export interface OmniScopedBackendFactoryResult<Entity extends ObjectLiteral> {
    providers: Provider[];
    repository: ClassType<GenericTypeORMRepository<Entity>>;
}
export declare function omniScopedBackendProvidersFactory<Entity extends ObjectLiteral>(options: OmniScopedBackendFactoryOptions<Entity>): OmniScopedBackendFactoryResult<Entity>;
export declare function omniBackendServiceToken(provider: Parameters<typeof getProviderToken>[0]): string;
