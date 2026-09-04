import { jest } from '@jest/globals';
declare let NestGraphql: any;
import { ExecutionContext } from '@nestjs/common';
import { DeepMocked, MockOptions, PartialFuncReturn } from '@golevelup/ts-jest';
import { SelectQueryBuilder } from 'typeorm';
export declare const mockedNestGraphql: () => jest.Mocked<typeof NestGraphql>;
export declare const mockedGqlCtxCreate: () => import("jest-mock").Mock<import("jest-mock").UnknownFunction>;
export declare const mockedExecutionContext: {
    getClass: import("jest-mock").MockInstance<() => import("@nestjs/common").Type<unknown>> & (() => {
        apply: import("jest-mock").MockInstance<(thisArg: any, argArray?: any) => any> & ((thisArg: any, argArray?: any) => any);
        call: import("jest-mock").MockInstance<(thisArg: any, ...argArray: any[]) => any> & ((thisArg: any, ...argArray: any[]) => any);
        bind: import("jest-mock").MockInstance<(thisArg: any, ...argArray: any[]) => any> & ((thisArg: any, ...argArray: any[]) => any);
        toString: import("jest-mock").MockInstance<() => string> & (() => string);
        prototype: any;
        readonly length: number;
        arguments: any;
        caller: {
            apply: import("jest-mock").MockInstance<(thisArg: any, argArray?: any) => any> & ((thisArg: any, argArray?: any) => any);
            call: import("jest-mock").MockInstance<(thisArg: any, ...argArray: any[]) => any> & ((thisArg: any, ...argArray: any[]) => any);
            bind: import("jest-mock").MockInstance<(thisArg: any, ...argArray: any[]) => any> & ((thisArg: any, ...argArray: any[]) => any);
            toString: import("jest-mock").MockInstance<() => string> & (() => string);
            prototype: any;
            readonly length: number;
            arguments: any;
            caller: {
                apply: import("jest-mock").MockInstance<(thisArg: any, argArray?: any) => any> & ((thisArg: any, argArray?: any) => any);
                call: import("jest-mock").MockInstance<(thisArg: any, ...argArray: any[]) => any> & ((thisArg: any, ...argArray: any[]) => any);
                bind: import("jest-mock").MockInstance<(thisArg: any, ...argArray: any[]) => any> & ((thisArg: any, ...argArray: any[]) => any);
                toString: import("jest-mock").MockInstance<() => string> & (() => string);
                prototype: any;
                readonly length: number;
                arguments: any;
                caller: Function;
                readonly name: string;
                [Symbol.hasInstance]: import("jest-mock").MockInstance<(value: any) => boolean> & ((value: any) => boolean);
                [Symbol.metadata]: DecoratorMetadata | null;
            } & Function;
            readonly name: string;
            [Symbol.hasInstance]: import("jest-mock").MockInstance<(value: any) => boolean> & ((value: any) => boolean);
            [Symbol.metadata]: ({
                [x: string]: any;
                [x: number]: any;
                [x: symbol]: any;
            } & Record<PropertyKey, unknown> & object) | null;
        } & Function;
        readonly name: string;
        [Symbol.hasInstance]: import("jest-mock").MockInstance<(value: any) => boolean> & ((value: any) => boolean);
        [Symbol.metadata]: ({
            [x: string]: any;
            [x: number]: any;
            [x: symbol]: any;
        } & Record<PropertyKey, unknown> & object) | null;
    } & import("@nestjs/common").Type<unknown>);
    getHandler: import("jest-mock").MockInstance<() => Function> & (() => {
        apply: import("jest-mock").MockInstance<(thisArg: any, argArray?: any) => any> & ((thisArg: any, argArray?: any) => any);
        call: import("jest-mock").MockInstance<(thisArg: any, ...argArray: any[]) => any> & ((thisArg: any, ...argArray: any[]) => any);
        bind: import("jest-mock").MockInstance<(thisArg: any, ...argArray: any[]) => any> & ((thisArg: any, ...argArray: any[]) => any);
        toString: import("jest-mock").MockInstance<() => string> & (() => string);
        prototype: any;
        readonly length: number;
        arguments: any;
        caller: {
            apply: import("jest-mock").MockInstance<(thisArg: any, argArray?: any) => any> & ((thisArg: any, argArray?: any) => any);
            call: import("jest-mock").MockInstance<(thisArg: any, ...argArray: any[]) => any> & ((thisArg: any, ...argArray: any[]) => any);
            bind: import("jest-mock").MockInstance<(thisArg: any, ...argArray: any[]) => any> & ((thisArg: any, ...argArray: any[]) => any);
            toString: import("jest-mock").MockInstance<() => string> & (() => string);
            prototype: any;
            readonly length: number;
            arguments: any;
            caller: {
                apply: import("jest-mock").MockInstance<(thisArg: any, argArray?: any) => any> & ((thisArg: any, argArray?: any) => any);
                call: import("jest-mock").MockInstance<(thisArg: any, ...argArray: any[]) => any> & ((thisArg: any, ...argArray: any[]) => any);
                bind: import("jest-mock").MockInstance<(thisArg: any, ...argArray: any[]) => any> & ((thisArg: any, ...argArray: any[]) => any);
                toString: import("jest-mock").MockInstance<() => string> & (() => string);
                prototype: any;
                readonly length: number;
                arguments: any;
                caller: Function;
                readonly name: string;
                [Symbol.hasInstance]: import("jest-mock").MockInstance<(value: any) => boolean> & ((value: any) => boolean);
                [Symbol.metadata]: DecoratorMetadata | null;
            } & Function;
            readonly name: string;
            [Symbol.hasInstance]: import("jest-mock").MockInstance<(value: any) => boolean> & ((value: any) => boolean);
            [Symbol.metadata]: ({
                [x: string]: any;
                [x: number]: any;
                [x: symbol]: any;
            } & Record<PropertyKey, unknown> & object) | null;
        } & Function;
        readonly name: string;
        [Symbol.hasInstance]: import("jest-mock").MockInstance<(value: any) => boolean> & ((value: any) => boolean);
        [Symbol.metadata]: ({
            [x: string]: any;
            [x: number]: any;
            [x: symbol]: any;
        } & Record<PropertyKey, unknown> & object) | null;
    } & Function);
    getArgs: import("jest-mock").MockInstance<() => any[]> & (() => any[]);
    getArgByIndex: import("jest-mock").MockInstance<(index: number) => unknown> & ((index: number) => {});
    switchToRpc: import("jest-mock").MockInstance<() => import("@nestjs/common/interfaces/index.js").RpcArgumentsHost> & (() => {
        getData: import("jest-mock").MockInstance<() => unknown> & (() => {});
        getContext: import("jest-mock").MockInstance<() => unknown> & (() => {});
    } & import("@nestjs/common/interfaces/index.js").RpcArgumentsHost);
    switchToHttp: import("jest-mock").MockInstance<() => import("@nestjs/common/interfaces/index.js").HttpArgumentsHost> & (() => {
        getRequest: import("jest-mock").MockInstance<() => unknown> & (() => {});
        getResponse: import("jest-mock").MockInstance<() => unknown> & (() => {});
        getNext: import("jest-mock").MockInstance<() => unknown> & (() => {});
    } & import("@nestjs/common/interfaces/index.js").HttpArgumentsHost);
    switchToWs: import("jest-mock").MockInstance<() => import("@nestjs/common/interfaces/index.js").WsArgumentsHost> & (() => {
        getData: import("jest-mock").MockInstance<() => unknown> & (() => {});
        getClient: import("jest-mock").MockInstance<() => unknown> & (() => {});
        getPattern: import("jest-mock").MockInstance<() => string> & (() => string);
    } & import("@nestjs/common/interfaces/index.js").WsArgumentsHost);
    getType: import("jest-mock").MockInstance<() => string> & (() => string);
} & ExecutionContext;
export declare const mockChainingObject: <T extends object>(partial?: PartialFuncReturn<T>, options?: MockOptions) => DeepMocked<T>;
export declare const mockQueryBuilder: <T extends object>(partial?: PartialFuncReturn<SelectQueryBuilder<T>>, options?: MockOptions) => DeepMocked<SelectQueryBuilder<T>>;
export {};
