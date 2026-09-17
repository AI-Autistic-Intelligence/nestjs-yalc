import * as http from 'http';
export type HttpEngineType = 'fastify' | 'express';
export interface FerroxHttpRequest {
    method: string;
    url: string;
    headers: Record<string, string | string[] | undefined>;
    body: any;
    query: Record<string, string | string[] | undefined>;
    params: Record<string, string>;
    raw: http.IncomingMessage;
}
export interface FerroxHttpResponse {
    statusCode: number;
    headers: Record<string, string | string[]>;
    status(code: number): FerroxHttpResponse;
    setHeader(name: string, value: string | string[]): FerroxHttpResponse;
    json(body: any): void;
    send(body: any): void;
    raw: http.ServerResponse;
}
export type FerroxRouteHandler = (req: FerroxHttpRequest, res: FerroxHttpResponse) => Promise<any> | any;
export interface FerroxRouteDefinition {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    path: string;
    handler: FerroxRouteHandler;
}
export interface IFerroxHttpAdapter {
    type: HttpEngineType;
    registerRoute(route: FerroxRouteDefinition): void;
    listen(port: number, host?: string): Promise<http.Server>;
    close(): Promise<void>;
}
export declare class ExpressHttpAdapter implements IFerroxHttpAdapter {
    type: HttpEngineType;
    private routes;
    private server?;
    registerRoute(route: FerroxRouteDefinition): void;
    listen(port: number, host?: string): Promise<http.Server>;
    close(): Promise<void>;
}
export declare class FastifyHttpAdapter implements IFerroxHttpAdapter {
    type: HttpEngineType;
    private routes;
    private server?;
    registerRoute(route: FerroxRouteDefinition): void;
    listen(port: number, host?: string): Promise<http.Server>;
    close(): Promise<void>;
}
