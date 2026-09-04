import type { IApiCallStrategy, ICallOptions, IObjectWithData } from '@nestjs-yalc/api-strategy/context-call.interface.js';
import { TelemetryService } from '../telemetry.service.js';
export interface TelemetryCallStrategyOptions {
    name: string;
    transport?: string;
}
export declare class TelemetryCallStrategy implements IApiCallStrategy {
    private readonly strategy;
    private readonly telemetry;
    private readonly options;
    constructor(strategy: IApiCallStrategy, telemetry: TelemetryService, options: TelemetryCallStrategyOptions);
    get baseUrl(): string | undefined;
    set baseUrl(value: string | undefined);
    call<TOptData, TParams extends Record<string, any>, TResData>(path: string, options?: ICallOptions<TOptData, TParams>): Promise<IObjectWithData<TResData>>;
    get<TOptData, TParams extends Record<string, any>, TResData>(path: string, options?: ICallOptions<TOptData, TParams>): Promise<IObjectWithData<TResData>>;
    post<TOptData, TParams extends Record<string, any>, TResData>(path: string, options?: ICallOptions<TOptData, TParams>): Promise<IObjectWithData<TResData>>;
    private measure;
}
