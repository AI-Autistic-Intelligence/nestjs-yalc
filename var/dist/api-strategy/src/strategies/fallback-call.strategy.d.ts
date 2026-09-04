import { IApiCallStrategy, ICallOptions, IObjectWithData } from '../context-call.interface.js';
export interface FallbackCallStrategyOptions {
    shouldFallback?: (error: unknown, strategyIndex: number) => boolean;
}
export declare class FallbackCallStrategy implements IApiCallStrategy {
    private readonly strategies;
    private readonly options;
    constructor(strategies: IApiCallStrategy[], options?: FallbackCallStrategyOptions);
    call<TOptData, TParams extends Record<string, any>, TResData>(path: string, options?: ICallOptions<TOptData, TParams>): Promise<IObjectWithData<TResData>>;
    get<TOptData, TParams extends Record<string, any>, TResData>(path: string, options?: ICallOptions<TOptData, TParams>): Promise<IObjectWithData<TResData>>;
    post<TOptData, TParams extends Record<string, any>, TResData>(path: string, options?: ICallOptions<TOptData, TParams>): Promise<IObjectWithData<TResData>>;
    private execute;
    private shouldFallback;
}
