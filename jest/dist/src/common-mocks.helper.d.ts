import * as NestGraphql from '@nestjs/graphql';
import { ExecutionContext } from '@nestjs/common';
import { DeepMocked, MockOptions, PartialFuncReturn } from '@golevelup/ts-jest';
import { SelectQueryBuilder } from 'typeorm';
export declare const mockedNestGraphql: jest.Mocked<typeof NestGraphql>;
export declare const mockedGqlCtxCreate: jest.Mock;
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
            } & Function;
            readonly name: string;
            [Symbol.hasInstance]: import("jest-mock").MockInstance<(value: any) => boolean> & ((value: any) => boolean);
        } & Function;
        readonly name: string;
        [Symbol.hasInstance]: import("jest-mock").MockInstance<(value: any) => boolean> & ((value: any) => boolean);
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
            } & Function;
            readonly name: string;
            [Symbol.hasInstance]: import("jest-mock").MockInstance<(value: any) => boolean> & ((value: any) => boolean);
        } & Function;
        readonly name: string;
        [Symbol.hasInstance]: import("jest-mock").MockInstance<(value: any) => boolean> & ((value: any) => boolean);
    } & Function);
    getArgs: import("jest-mock").MockInstance<() => any[]> & (() => any[]);
    getArgByIndex: import("jest-mock").MockInstance<(index: number) => unknown> & ((index: number) => {});
    switchToRpc: import("jest-mock").MockInstance<() => import("@nestjs/common/interfaces").RpcArgumentsHost> & (() => {
        getData: import("jest-mock").MockInstance<() => unknown> & (() => {});
        getContext: import("jest-mock").MockInstance<() => unknown> & (() => {});
    } & import("@nestjs/common/interfaces").RpcArgumentsHost);
    switchToHttp: import("jest-mock").MockInstance<() => import("@nestjs/common/interfaces").HttpArgumentsHost> & (() => {
        getRequest: import("jest-mock").MockInstance<() => unknown> & (() => {});
        getResponse: import("jest-mock").MockInstance<() => unknown> & (() => {});
        getNext: import("jest-mock").MockInstance<() => unknown> & (() => {});
    } & import("@nestjs/common/interfaces").HttpArgumentsHost);
    switchToWs: import("jest-mock").MockInstance<() => import("@nestjs/common/interfaces").WsArgumentsHost> & (() => {
        getData: import("jest-mock").MockInstance<() => unknown> & (() => {});
        getClient: import("jest-mock").MockInstance<() => unknown> & (() => {});
        getPattern: import("jest-mock").MockInstance<() => string> & (() => string);
    } & import("@nestjs/common/interfaces").WsArgumentsHost);
    getType: import("jest-mock").MockInstance<() => string> & (() => string);
} & ExecutionContext;
export declare const mockChainingObject: <T extends object>(partial?: PartialFuncReturn<T>, options?: MockOptions) => DeepMocked<T>;
export declare const mockQueryBuilder: <T extends object>(partial?: PartialFuncReturn<SelectQueryBuilder<T>>, options?: MockOptions) => DeepMocked<SelectQueryBuilder<T>>;
