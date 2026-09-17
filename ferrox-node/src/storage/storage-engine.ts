export interface StorageObject {
  key: string;
  content: Buffer;
  mimeType: string;
  size: number;
}

export interface IStorageAdapter {
  upload(key: string, content: Buffer | string, mimeType?: string): Promise<string>;
  download(key: string): Promise<Buffer>;
  delete(key: string): Promise<boolean>;
  getPresignedUrl(key: string, ttlSecs?: number): Promise<string>;
}

export class MemoryStorageAdapter implements IStorageAdapter {
  private store: Map<string, StorageObject> = new Map();

  async upload(key: string, content: Buffer | string, mimeType: string = 'application/octet-stream'): Promise<string> {
    const buf = typeof content === 'string' ? Buffer.from(content) : content;
    this.store.set(key, { key, content: buf, mimeType, size: buf.length });
    return `memory://${key}`;
  }

  async download(key: string): Promise<Buffer> {
    const obj = this.store.get(key);
    if (!obj) throw new Error(`Object not found in MemoryStorage: ${key}`);
    return obj.content;
  }

  async delete(key: string): Promise<boolean> {
    return this.store.delete(key);
  }

  async getPresignedUrl(key: string, ttlSecs: number = 3600): Promise<string> {
    return `https://storage.ferrox.dev/memory/${key}?ttl=${ttlSecs}`;
  }
}

export class StorageEngine {
  private adapter: IStorageAdapter;

  constructor(adapter: IStorageAdapter = new MemoryStorageAdapter()) {
    this.adapter = adapter;
  }

  public async upload(key: string, content: Buffer | string, mimeType?: string): Promise<string> {
    return await this.adapter.upload(key, content, mimeType);
  }

  public async download(key: string): Promise<Buffer> {
    return await this.adapter.download(key);
  }

  public async delete(key: string): Promise<boolean> {
    return await this.adapter.delete(key);
  }

  public async getPresignedUrl(key: string, ttlSecs?: number): Promise<string> {
    return await this.adapter.getPresignedUrl(key, ttlSecs);
  }
}
