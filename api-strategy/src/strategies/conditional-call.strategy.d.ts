import { IApiCallStrategy, ICallOptions, IObjectWithData } from '../context-call.interface.js';
export interface ConditionalCallStrategyOptions {
    enabled?: boolean | (() => boolean);
    disabledResponse?: IObjectWithData<any>;
    disabledError?: Error | (() => Error);
}
export declare class ConditionalCallStrategy implements IApiCallStrategy {
    private readonly strategy;
    private readonly options;
    constructor(strategy: IApiCallStrategy, options?: ConditionalCallStrategyOptions);
    call<TOptData, TParams extends Record<string, any>, TResData>(path: string, options?: ICallOptions<TOptData, TParams>): Promise<IObjectWithData<TResData>>;
    get<TOptData, TParams extends Record<string, any>, TResData>(path: string, options?: ICallOptions<TOptData, TParams>): Promise<IObjectWithData<TResData>>;
    post<TOptData, TParams extends Record<string, any>, TResData>(path: string, options?: ICallOptions<TOptData, TParams>): Promise<IObjectWithData<TResData>>;
    private whenEnabled;
    private isEnabled;
    private resolveDisabledError;
}
