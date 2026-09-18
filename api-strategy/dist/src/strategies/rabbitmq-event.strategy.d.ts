import { OnModuleDestroy } from '@nestjs/common';
import type { ClassType } from '@node-yalc/types/globals';
import { Options } from 'amqplib';
import { IEventStrategy } from '../context-event.interface.js';
export interface RabbitMqEventStrategyOptions<P = any> {
    url: string;
    exchange: string;
    exchangeType?: string;
    durable?: boolean;
    persistent?: boolean;
    contentType?: string;
    publishOptions?: Options.Publish;
    serialize?: (payload: P) => Buffer | string;
}
export declare class RabbitMqEventStrategy<P = any, O = any> implements IEventStrategy<P, boolean, O>, OnModuleDestroy {
    private readonly options;
    private connection?;
    private channel?;
    constructor(options: RabbitMqEventStrategyOptions<P>);
    emit(path: string, payload: P): boolean;
    emitAsync(path: string, payload: P): Promise<boolean>;
    onModuleDestroy(): Promise<void>;
    private publish;
    private serialize;
    private getChannel;
}
export interface RabbitMqEventStrategyProviderOptions<P = any> {
    RabbitMqStrategy?: ClassType<RabbitMqEventStrategy<P>>;
    options: RabbitMqEventStrategyOptions<P> | (() => RabbitMqEventStrategyOptions<P>);
}
export declare const RabbitMqEventStrategyProvider: <P = any>(provide: string, options: RabbitMqEventStrategyProviderOptions<P>) => {
    provide: string;
    useFactory: () => RabbitMqEventStrategy<P, any> | RabbitMqEventStrategy<any, any>;
};
