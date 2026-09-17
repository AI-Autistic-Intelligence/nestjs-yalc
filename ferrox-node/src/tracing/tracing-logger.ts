import * as crypto from 'crypto';

export interface TraceContext {
  traceId: string;
  spanId: string;
  sampled: boolean;
}

export class TracingEngine {
  public static createTraceContext(): TraceContext {
    return {
      traceId: crypto.randomBytes(16).toString('hex'),
      spanId: crypto.randomBytes(8).toString('hex'),
      sampled: true,
    };
  }

  public static parseTraceparent(header?: string): TraceContext {
    if (!header || !header.startsWith('00-')) {
      return this.createTraceContext();
    }
    const parts = header.split('-');
    if (parts.length >= 4) {
      return {
        traceId: parts[1],
        spanId: parts[2],
        sampled: parts[3] === '01',
      };
    }
    return this.createTraceContext();
  }

  public static formatTraceparent(ctx: TraceContext): string {
    return `00-${ctx.traceId}-${ctx.spanId}-${ctx.sampled ? '01' : '00'}`;
  }
}

export class FerroxLogger {
  private serviceName: string;

  constructor(serviceName: string = 'ferrox-node-app') {
    this.serviceName = serviceName;
  }

  public info(message: string, meta: Record<string, any> = {}): void {
    this.log('INFO', message, meta);
  }

  public warn(message: string, meta: Record<string, any> = {}): void {
    this.log('WARN', message, meta);
  }

  public error(message: string, meta: Record<string, any> = {}): void {
    this.log('ERROR', message, meta);
  }

  private log(level: string, message: string, meta: Record<string, any>): void {
    const entry = {
      timestamp: new Date().toISOString(),
      service: this.serviceName,
      level,
      message,
      ...meta,
    };
    console.log(JSON.stringify(entry));
  }
}
