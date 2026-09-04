import { ClsService } from 'nestjs-cls';
import { ClsStore } from 'nestjs-cls/dist/src/lib/cls.options.js';
import { AsyncLocalStorage } from 'node:async_hooks';
export interface IYalcCls extends ClsStore {
    headers: Record<string, string>;
}
export declare class YalcGlobalClsService<TCls extends IYalcCls = IYalcCls> extends ClsService<TCls> {
}
export interface IYalcAsyncLocalStorageAls {
    placeholder: string;
}
export declare class YalcAlsService<TStorage extends IYalcAsyncLocalStorageAls = IYalcAsyncLocalStorageAls> extends AsyncLocalStorage<TStorage> {
}
export declare class YalcClsModule {
}
