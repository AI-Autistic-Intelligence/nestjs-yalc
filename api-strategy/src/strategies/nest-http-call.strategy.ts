import { ClassType } from '@node-yalc/types/globals.js';
import { HttpService } from '@nestjs/axios';
import {
  HttpAbstractStrategy,
  IHttpCallStrategyResponse,
  HttpOptions,
  IHttpCallStrategyOptions,
} from './http-abstract-call.strategy.js';
import { AxiosRequestConfig } from 'axios';
import { YalcGlobalClsService } from '@nest-yalc-2/app/cls.module.js';
import { filterHeaders } from '../header-whitelist.helper.js';
import type { OutgoingHttpHeaders } from 'node:http2';

export type NestHttpCallStrategyOptions = IHttpCallStrategyOptions & {
  internalRequestHeader?: string;
  internalRequestToken?: string;
};

export class NestHttpCallStrategy extends HttpAbstractStrategy {
  private readonly internalHeader: string;
  private readonly internalToken?: string;

  constructor(
    protected readonly httpService: HttpService,
    protected readonly clsService: YalcGlobalClsService,
    private baseUrl = '',
    protected readonly options: NestHttpCallStrategyOptions = {},
  ) {
    super();
    this.internalHeader =
      options.internalRequestHeader ?? 'x-internal-request-token';
    if (options.internalRequestToken !== undefined) {
      this.internalToken = options.internalRequestToken;
    }
  }

  async call<TOptData, TParams extends Record<string, unknown>, TResData>(
    path: string,
    options?: HttpOptions<TOptData, TParams>,
  ): Promise<IHttpCallStrategyResponse<TResData>> {
    const clsHeaders = filterHeaders(
      this.clsService.get('headers'),
      this.options.headersWhitelist,
    );
    const headers: Record<string, unknown> = {
      ...clsHeaders,
      ...(options?.headers ?? {}),
    };
    if (
      this.internalHeader &&
      this.internalToken &&
      !headers[this.internalHeader]
    ) {
      headers[this.internalHeader] = this.internalToken;
    }
    /**
     * We need this to do a type check on the options and
     * implement the mapping from HttpOptions to AxiosRequestConfig
     */
    const _options:
      | {
          [k: string | number | symbol]: never;
        }
      | AxiosRequestConfig = {
      ...(headers !== undefined ? { headers: headers as AxiosRequestConfig['headers'] } : {}),
      ...(options?.method !== undefined ? { method: options.method } : {}),
      ...(options?.signal !== undefined ? { signal: options.signal } : {}),
      ...(options?.data !== undefined ? { data: options.data } : {}),
    } as AxiosRequestConfig;

    if (options?.parameters) {
      _options.params = new URLSearchParams(options.parameters as Record<string, string>);
    }

    const { data, ...res } = await this.httpService.axiosRef.request({
      ..._options,
      headers: _options?.headers as any,
      url: `${this.baseUrl}${path}`,
    });

    return {
      ...res,
      headers: res.headers as OutgoingHttpHeaders,
      data,
    };
  }
}

export interface NestHttpCallStrategyProviderOptions {
  baseUrl?: string;
  NestHttpStrategy?: ClassType<NestHttpCallStrategy>;
  headersWhitelist?: string[];
  internalRequestHeader?: string;
  internalRequestToken?: string;
}

/**
 * Just a convenient provider to inject the NestLocalCallStrategy
 */
export const NestHttpCallStrategyProvider = (
  provide: string,
  options: NestHttpCallStrategyProviderOptions = {},
) => ({
  provide,
  useFactory: (httpAdapter: HttpService, clsService: YalcGlobalClsService) => {
    const _options = {
      baseUrl: '',
      NestHttpStrategy: NestHttpCallStrategy,
      ...options,
    };

    return new _options.NestHttpStrategy(
      httpAdapter,
      clsService,
      _options.baseUrl,
      _options,
    );
  },
  inject: [HttpService, YalcGlobalClsService],
});
