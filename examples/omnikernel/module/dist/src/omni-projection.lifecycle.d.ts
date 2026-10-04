import type { InjectionToken } from '@nestjs/common';
import type { EntityManager, ObjectLiteral } from 'typeorm';
import type { OmniProjectionTransactionReaders } from './omni-projection.catalog.js';
import type { OmniScope } from './omni-scope.js';
export interface OmniProjectionLifecycleContext<Definition, Entity extends ObjectLiteral> {
    readonly definition: Definition;
    readonly scope: OmniScope;
    readonly manager: EntityManager;
    readonly readers: OmniProjectionTransactionReaders;
    readonly input: Readonly<Record<string, unknown>>;
    readonly current?: Entity;
}
export interface OmniProjectionLifecycle<Definition, Entity extends ObjectLiteral> {
    beforeCreate?(context: OmniProjectionLifecycleContext<Definition, Entity>): void | Promise<void>;
    beforeUpdate?(context: OmniProjectionLifecycleContext<Definition, Entity>): void | Promise<void>;
    beforeDelete?(context: OmniProjectionLifecycleContext<Definition, Entity>): void | Promise<void>;
}
export interface OmniProjectionLifecycleProvider<Definition, Entity extends ObjectLiteral> {
    readonly token: InjectionToken<OmniProjectionLifecycle<Definition, Entity>>;
}
