"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FerroxLogger = exports.TracingEngine = void 0;
const tslib_1 = require("tslib");
const crypto = tslib_1.__importStar(require("crypto"));
class TracingEngine {
    static createTraceContext() {
        return {
            traceId: crypto.randomBytes(16).toString('hex'),
            spanId: crypto.randomBytes(8).toString('hex'),
            sampled: true,
        };
    }
    static parseTraceparent(header) {
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
    static formatTraceparent(ctx) {
        return `00-${ctx.traceId}-${ctx.spanId}-${ctx.sampled ? '01' : '00'}`;
    }
}
exports.TracingEngine = TracingEngine;
class FerroxLogger {
    constructor(serviceName = 'ferrox-node-app') {
        this.serviceName = serviceName;
    }
    info(message, meta = {}) {
        this.log('INFO', message, meta);
    }
    warn(message, meta = {}) {
        this.log('WARN', message, meta);
    }
    error(message, meta = {}) {
        this.log('ERROR', message, meta);
    }
    log(level, message, meta) {
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
exports.FerroxLogger = FerroxLogger;
//# sourceMappingURL=tracing-logger.js.map