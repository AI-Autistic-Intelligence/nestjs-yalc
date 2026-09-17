"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FerroxLogger = exports.TracingEngine = void 0;
const crypto = __importStar(require("crypto"));
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
    serviceName;
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
