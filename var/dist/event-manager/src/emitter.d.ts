import { EventEmitter2 } from '@nestjs/event-emitter';
export type EventNameFormatter = (...args: any[]) => string;
export interface IEventEmitterOptions<TFormatter extends EventNameFormatter> {
    formatter?: TFormatter;
    mask?: string[];
    await?: boolean;
}
export declare function formatName<TFormatter extends EventNameFormatter>(name: Parameters<TFormatter> | string, formatter?: TFormatter): string;
export declare function emitEvent<TFormatter extends EventNameFormatter>(eventEmitter: EventEmitter2, name: Parameters<TFormatter> | string, payload: any, options?: IEventEmitterOptions<TFormatter>): Promise<boolean | any[]>;
export declare function emitFormattedEvent(eventEmitter: EventEmitter2, name: string, payload: any, options?: IEventEmitterOptions<SimpleFormatter>): Promise<boolean | any[]>;
export type VersionedDomainActionFormatter = (version: string, context: string, action: string, when?: string) => string;
export declare const versionedDomainActionFormatter: VersionedDomainActionFormatter;
export type SimpleDotFormatter = (...args: string[]) => string;
export declare const simpleDotFormatter: SimpleDotFormatter;
export type SimpleFormatter = (action: string) => string;
export declare const simpleFormatter: SimpleFormatter;
