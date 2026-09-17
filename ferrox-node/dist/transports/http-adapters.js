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
exports.FastifyHttpAdapter = exports.ExpressHttpAdapter = void 0;
const http = __importStar(require("http"));
class ExpressHttpAdapter {
    type = 'express';
    routes = [];
    server;
    registerRoute(route) {
        this.routes.push(route);
    }
    async listen(port, host = '0.0.0.0') {
        this.server = http.createServer(async (req, res) => {
            const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
            const method = req.method || 'GET';
            const pathname = url.pathname;
            let body = null;
            if (['POST', 'PUT', 'PATCH'].includes(method)) {
                const buffers = [];
                for await (const chunk of req) {
                    buffers.push(chunk);
                }
                const rawBody = Buffer.concat(buffers).toString('utf-8');
                try {
                    body = rawBody ? JSON.parse(rawBody) : null;
                }
                catch {
                    body = rawBody;
                }
            }
            const match = this.routes.find((r) => r.method === method && (r.path === pathname || r.path === pathname + '/'));
            const ferroxReq = {
                method,
                url: req.url || '/',
                headers: req.headers,
                body,
                query: Object.fromEntries(url.searchParams.entries()),
                params: {},
                raw: req,
            };
            const responseHeaders = {
                'X-Powered-By': 'Ferrox-Node Framework v0.6.0 (Express-Engine)',
            };
            const ferroxRes = {
                statusCode: 200,
                headers: responseHeaders,
                status(code) {
                    this.statusCode = code;
                    return this;
                },
                setHeader(name, value) {
                    this.headers[name] = value;
                    return this;
                },
                json(data) {
                    res.writeHead(this.statusCode, {
                        'Content-Type': 'application/json; charset=utf-8',
                        ...this.headers,
                    });
                    res.end(JSON.stringify(data));
                },
                send(data) {
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
                }
                catch (err) {
                    ferroxRes.status(500).json({
                        error: 'Internal Server Error',
                        message: err.message || 'An unexpected error occurred in Ferrox handler',
                    });
                }
            }
            else {
                ferroxRes.status(404).json({
                    error: 'Not Found',
                    message: `Cannot ${method} ${pathname}`,
                });
            }
        });
        return new Promise((resolve) => {
            this.server.listen(port, host, () => resolve(this.server));
        });
    }
    async close() {
        if (this.server) {
            return new Promise((resolve) => this.server.close(() => resolve()));
        }
    }
}
exports.ExpressHttpAdapter = ExpressHttpAdapter;
class FastifyHttpAdapter {
    type = 'fastify';
    routes = [];
    server;
    registerRoute(route) {
        this.routes.push(route);
    }
    async listen(port, host = '0.0.0.0') {
        this.server = http.createServer(async (req, res) => {
            const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
            const method = req.method || 'GET';
            const pathname = url.pathname;
            let body = null;
            if (['POST', 'PUT', 'PATCH'].includes(method)) {
                const buffers = [];
                for await (const chunk of req) {
                    buffers.push(chunk);
                }
                const rawBody = Buffer.concat(buffers).toString('utf-8');
                try {
                    body = rawBody ? JSON.parse(rawBody) : null;
                }
                catch {
                    body = rawBody;
                }
            }
            const match = this.routes.find((r) => r.method === method && (r.path === pathname || r.path === pathname + '/'));
            const ferroxReq = {
                method,
                url: req.url || '/',
                headers: req.headers,
                body,
                query: Object.fromEntries(url.searchParams.entries()),
                params: {},
                raw: req,
            };
            const responseHeaders = {
                'X-Powered-By': 'Ferrox-Node Framework v0.6.0 (Fastify-Engine)',
            };
            const ferroxRes = {
                statusCode: 200,
                headers: responseHeaders,
                status(code) {
                    this.statusCode = code;
                    return this;
                },
                setHeader(name, value) {
                    this.headers[name] = value;
                    return this;
                },
                json(data) {
                    res.writeHead(this.statusCode, {
                        'Content-Type': 'application/json; charset=utf-8',
                        ...this.headers,
                    });
                    res.end(JSON.stringify(data));
                },
                send(data) {
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
                }
                catch (err) {
                    ferroxRes.status(500).json({
                        error: 'Internal Server Error',
                        message: err.message || 'An unexpected error occurred in Ferrox handler',
                    });
                }
            }
            else {
                ferroxRes.status(404).json({
                    error: 'Not Found',
                    message: `Cannot ${method} ${pathname}`,
                });
            }
        });
        return new Promise((resolve) => {
            this.server.listen(port, host, () => resolve(this.server));
        });
    }
    async close() {
        if (this.server) {
            return new Promise((resolve) => this.server.close(() => resolve()));
        }
    }
}
exports.FastifyHttpAdapter = FastifyHttpAdapter;
