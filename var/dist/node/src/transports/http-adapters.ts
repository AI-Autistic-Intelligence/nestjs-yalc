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

export class ExpressHttpAdapter implements IFerroxHttpAdapter {
  public type: HttpEngineType = 'express';
  private routes: FerroxRouteDefinition[] = [];
  private server?: http.Server;

  registerRoute(route: FerroxRouteDefinition): void {
    this.routes.push(route);
  }

  async listen(port: number, host: string = '0.0.0.0'): Promise<http.Server> {
    this.server = http.createServer(async (req, res) => {
      const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
      const method = req.method || 'GET';
      const pathname = url.pathname;

      let body: any = null;
      if (['POST', 'PUT', 'PATCH'].includes(method)) {
        const buffers: Buffer[] = [];
        for await (const chunk of req) {
          buffers.push(chunk as Buffer);
        }
        const rawBody = Buffer.concat(buffers).toString('utf-8');
        try {
          body = rawBody ? JSON.parse(rawBody) : null;
        } catch {
          body = rawBody;
        }
      }

      const match = this.routes.find((r) => r.method === method && (r.path === pathname || r.path === pathname + '/'));

      const ferroxReq: FerroxHttpRequest = {
        method,
        url: req.url || '/',
        headers: req.headers as Record<string, string | string[] | undefined>,
        body,
        query: Object.fromEntries(url.searchParams.entries()),
        params: {},
        raw: req,
      };

      const responseHeaders: Record<string, string | string[]> = {
        'X-Powered-By': 'Ferrox-Node Framework v0.6.0 (Express-Engine)',
      };

      const ferroxRes: FerroxHttpResponse = {
        statusCode: 200,
        headers: responseHeaders,
        status(code: number) {
          this.statusCode = code;
          return this;
        },
        setHeader(name: string, value: string | string[]) {
          this.headers[name] = value;
          return this;
        },
        json(data: any) {
          res.writeHead(this.statusCode, {
            'Content-Type': 'application/json; charset=utf-8',
            ...this.headers,
          });
          res.end(JSON.stringify(data));
        },
        send(data: any) {
          res.writeHead(this.statusCode, this.headers);
          res.end(typeof data === 'string' ? data : JSON.stringify(data));
        },
        raw: res,
      };

      if (match) {
        try {
          const result = await match.handler(ferroxReq, ferroxRes);
          if (result !== undefined && !res.writableEnded) {
            ferroxRes.json(result);
          }
        } catch (err: any) {
          ferroxRes.status(500).json({
            error: 'Internal Server Error',
            message: err.message || 'An unexpected error occurred in Ferrox handler',
          });
        }
      } else {
        ferroxRes.status(404).json({
          error: 'Not Found',
          message: `Cannot ${method} ${pathname}`,
        });
      }
    });

    return new Promise((resolve) => {
      this.server!.listen(port, host, () => resolve(this.server!));
    });
  }

  async close(): Promise<void> {
    if (this.server) {
      return new Promise((resolve) => this.server!.close(() => resolve()));
    }
  }
}

export class FastifyHttpAdapter implements IFerroxHttpAdapter {
  public type: HttpEngineType = 'fastify';
  private routes: FerroxRouteDefinition[] = [];
  private server?: http.Server;

  registerRoute(route: FerroxRouteDefinition): void {
    this.routes.push(route);
  }

  async listen(port: number, host: string = '0.0.0.0'): Promise<http.Server> {
    this.server = http.createServer(async (req, res) => {
      const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
      const method = req.method || 'GET';
      const pathname = url.pathname;

      let body: any = null;
      if (['POST', 'PUT', 'PATCH'].includes(method)) {
        const buffers: Buffer[] = [];
        for await (const chunk of req) {
          buffers.push(chunk as Buffer);
        }
        const rawBody = Buffer.concat(buffers).toString('utf-8');
        try {
          body = rawBody ? JSON.parse(rawBody) : null;
        } catch {
          body = rawBody;
        }
      }

      const match = this.routes.find((r) => r.method === method && (r.path === pathname || r.path === pathname + '/'));

      const ferroxReq: FerroxHttpRequest = {
        method,
        url: req.url || '/',
        headers: req.headers as Record<string, string | string[] | undefined>,
        body,
        query: Object.fromEntries(url.searchParams.entries()),
        params: {},
        raw: req,
      };

      const responseHeaders: Record<string, string | string[]> = {
        'X-Powered-By': 'Ferrox-Node Framework v0.6.0 (Fastify-Engine)',
      };

      const ferroxRes: FerroxHttpResponse = {
        statusCode: 200,
        headers: responseHeaders,
        status(code: number) {
          this.statusCode = code;
          return this;
        },
        setHeader(name: string, value: string | string[]) {
          this.headers[name] = value;
          return this;
        },
        json(data: any) {
          res.writeHead(this.statusCode, {
            'Content-Type': 'application/json; charset=utf-8',
            ...this.headers,
          });
          res.end(JSON.stringify(data));
        },
        send(data: any) {
          res.writeHead(this.statusCode, this.headers);
          res.end(typeof data === 'string' ? data : JSON.stringify(data));
        },
        raw: res,
      };

      if (match) {
        try {
          const result = await match.handler(ferroxReq, ferroxRes);
          if (result !== undefined && !res.writableEnded) {
            ferroxRes.json(result);
          }
        } catch (err: any) {
          ferroxRes.status(500).json({
            error: 'Internal Server Error',
            message: err.message || 'An unexpected error occurred in Ferrox handler',
          });
        }
      } else {
        ferroxRes.status(404).json({
          error: 'Not Found',
          message: `Cannot ${method} ${pathname}`,
        });
      }
    });

    return new Promise((resolve) => {
      this.server!.listen(port, host, () => resolve(this.server!));
    });
  }

  async close(): Promise<void> {
    if (this.server) {
      return new Promise((resolve) => this.server!.close(() => resolve()));
    }
  }
}
