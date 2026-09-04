import { AnyFunction } from '@nestjs-yalc/types/globals.d.js';
import { MonoTypeOperatorFunction, ObservableInput, Observable, UnaryFunction } from 'rxjs';
export declare function wrapIntoObservable<T>(input: Promise<T> | {
    (): Promise<T>;
} | Observable<T> | T | void): Observable<T>;
export declare function wrapIntoAnOperator(input: AnyFunction): UnaryFunction<any, any>;
export declare function switchTap<T, O extends ObservableInput<any>>(project: (value: T, index: number) => O): MonoTypeOperatorFunction<T>;
