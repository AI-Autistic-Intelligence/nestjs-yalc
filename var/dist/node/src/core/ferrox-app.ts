import * as http from 'http';
import {
  HttpEngineType,
  IFerroxHttpAdapter,
  ExpressHttpAdapter,
  FastifyHttpAdapter,
  FerroxRouteDefinition,
} from '../transports/http-adapters';
import { getControllerMetadata } from '../routing/decorators';
import { FerroxSentinelSecurityEngine } from '../security/sentinel-integration';

export interface FerroxAppOptions {
  engine?: HttpEngineType;
  port?: number;
  host?: string;
  controllers?: any[];
  globalGuards?: any[];
  sentinelSecretKey?: string;
}

export class FerroxApp {
  private adapter: IFerroxHttpAdapter;
  private port: number;
  private host: string;
  private controllers: any[];
  private globalGuards: any[];
  public sentinel: FerroxSentinelSecurityEngine;
  private server?: http.Server;

  constructor(options: FerroxAppOptions = {}) {
    const engineType = options.engine || 'fastify';
    this.adapter = engineType === 'express' ? new ExpressHttpAdapter() : new FastifyHttpAdapter();
    this.port = options.port || 8080;
    this.host = options.host || '0.0.0.0';
    this.controllers = options.controllers || [];
    this.globalGuards = options.globalGuards || [];
    this.sentinel = new FerroxSentinelSecurityEngine(options.sentinelSecretKey);

    this.registerControllers();
  }

  private registerControllers(): void {
    for (const controllerInstance of this.controllers) {
      const meta = getControllerMetadata(controllerInstance);
      const prefix = meta.prefix;

      for (const routeMeta of meta.routes) {
        const fullPath = (prefix + routeMeta.path).replace(/\/+/g, '/');
        const handlerFn = controllerInstance[routeMeta.handlerName].bind(controllerInstance);

        const routeDef: FerroxRouteDefinition = {
          method: routeMeta.method,
          path: fullPath,
          handler: async (req, res) => {
            // 1. Run global guards
            for (const guard of this.globalGuards) {
              const allowed = await guard.canActivate(req, res);
              if (!allowed) return;
            }

            // 2. Run controller / route guards
            for (const guard of routeMeta.guards) {
              const allowed = await guard.canActivate(req, res);
              if (!allowed) return;
            }

            // 3. Execute controller handler
            return await handlerFn(req, res);
          },
        };

        this.adapter.registerRoute(routeDef);
      }
    }
  }

  public async start(): Promise<http.Server> {
    console.log(`\n================================================================`);
    console.log(`🚀 Ferrox Enterprise Node.js / TypeScript Security Framework v0.6.0`);
    console.log(`⚡ Engine: ${this.adapter.type.toUpperCase()} | Port: ${this.port}`);
    console.log(`🛡️ Sentinel AI & LSM Kernel Sandbox: ACTIVE`);
    console.log(`================================================================\n`);

    this.server = await this.adapter.listen(this.port, this.host);

    process.on('SIGINT', () => this.shutdown());
    process.on('SIGTERM', () => this.shutdown());

    return this.server;
  }

  public async shutdown(): Promise<void> {
    console.log(`\n🛑 Gracefully shutting down Ferrox-Node Framework application...`);
    await this.adapter.close();
    console.log(`👋 Shutdown complete.`);
  }
}
