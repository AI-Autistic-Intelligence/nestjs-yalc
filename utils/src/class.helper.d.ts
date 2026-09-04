import { ClassType } from '@nestjs-yalc/types/globals.d.js';
export declare function isNativeClass<T = any>(func: any, className?: string): func is ClassType<T>;
export declare function isES6Class<T = any>(func: any, className?: string): func is ClassType<T>;
export declare function isClass<T = any>(func: any, className?: string): func is ClassType<T>;
