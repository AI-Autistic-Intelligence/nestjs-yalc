import { IApiCallStrategy, ICallOptions, IObjectWithData } from '../context-call.interface.js';
export type ShadowCallStrategyErrorMode = 'throw' | 'ignore';
export interface ShadowCallStrategyOptions {
    awaitShadows?: boolean;
    shadowErrorMode?: ShadowCallStrategyErrorMode;
}
export declare class ShadowCallStrategy implements IApiCallStrategy {
    private readonly primary;
    private readonly shadows;
    private readonly awaitShadows;
    private readonly shadowErrorMode;
    constructor(primary: IApiCallStrategy, shadows: IApiCallStrategy[], options?: ShadowCallStrategyOptions);
    call<TOptData, TParams extends Record<string, any>, TResData>(path: string, options?: ICallOptions<TOptData, TParams>): Promise<IObjectWithData<TResData>>;
    get<TOptData, TParams extends Record<string, any>, TResData>(path: string, options?: ICallOptions<TOptData, TParams>): Promise<IObjectWithData<TResData>>;
    post<TOptData, TParams extends Record<string, any>, TResData>(path: string, options?: ICallOptions<TOptData, TParams>): Promise<IObjectWithData<TResData>>;
    private execute;
}
