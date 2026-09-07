import { ClassType } from '@nest-yalc-2/types/globals.d.js';
export interface PluginMethods extends Record<string, {
    (...args: any[]): void;
} | undefined> {
}
export interface Plugin<T extends PluginMethods> {
    pluginMethods: T;
}
export interface PluginSystem<T extends PluginMethods> {
    registerPlugin(plugin: Plugin<T>): void;
    unregisterPlugin(plugin: Plugin<T>): void;
    invokePlugins(methodName: keyof T, ...args: any[]): void;
}
export declare function WithPluginSystem<U extends PluginMethods>(Base?: ClassType): {
    new (...args: any[]): {
        [x: string]: any;
        plugins: Plugin<U>[];
        registerPlugin(plugin: Plugin<U>): void;
        unregisterPlugin(plugin: Plugin<U>): void;
        invokePlugins(methodName: keyof U, ...args: any[]): void;
    };
};
