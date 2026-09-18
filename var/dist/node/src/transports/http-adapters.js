"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FastifyHttpAdapter = exports.ExpressHttpAdapter = void 0;
const tslib_1 = require("tslib");
const http = tslib_1.__importStar(require("http"));
class ExpressHttpAdapter {
    constructor() {
        this.type = 'express';
        this.routes = [];
    }
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
    constructor() {
        this.type = 'fastify';
        this.routes = [];
    }
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
//# sourceMappingURL=http-adapters.js.map