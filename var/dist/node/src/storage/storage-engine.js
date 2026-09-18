"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageEngine = exports.MemoryStorageAdapter = void 0;
class MemoryStorageAdapter {
    constructor() {
        this.store = new Map();
    }
    async upload(key, content, mimeType = 'application/octet-stream') {
        const buf = typeof content === 'string' ? Buffer.from(content) : content;
        this.store.set(key, { key, content: buf, mimeType, size: buf.length });
        return `memory://${key}`;
    }
    async download(key) {
        const obj = this.store.get(key);
        if (!obj)
            throw new Error(`Object not found in MemoryStorage: ${key}`);
        return obj.content;
    }
    async delete(key) {
        return this.store.delete(key);
    }
    async getPresignedUrl(key, ttlSecs = 3600) {
        return `https://storage.ferrox.dev/memory/${key}?ttl=${ttlSecs}`;
    }
}
exports.MemoryStorageAdapter = MemoryStorageAdapter;
class StorageEngine {
    constructor(adapter = new MemoryStorageAdapter()) {
        this.adapter = adapter;
    }
    async upload(key, content, mimeType) {
        return await this.adapter.upload(key, content, mimeType);
    }
    async download(key) {
        return await this.adapter.download(key);
    }
    async delete(key) {
        return await this.adapter.delete(key);
    }
    async getPresignedUrl(key, ttlSecs) {
        return await this.adapter.getPresignedUrl(key, ttlSecs);
    }
}
exports.StorageEngine = StorageEngine;
//# sourceMappingURL=storage-engine.js.map