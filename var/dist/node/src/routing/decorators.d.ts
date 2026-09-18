export interface RouteMetadata {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    path: string;
    handlerName: string;
    guards: any[];
}
export interface ControllerMetadata {
    prefix: string;
    guards: any[];
    routes: RouteMetadata[];
}
export declare function Controller(prefix?: string): ClassDecorator;
export declare const Get: (path?: string) => MethodDecorator;
export declare const Post: (path?: string) => MethodDecorator;
export declare const Put: (path?: string) => MethodDecorator;
export declare const Delete: (path?: string) => MethodDecorator;
export declare const Patch: (path?: string) => MethodDecorator;
export declare function UseGuard(...guards: any[]): MethodDecorator & ClassDecorator;
export declare function Roles(...roles: string[]): MethodDecorator & ClassDecorator;
export declare function getControllerMetadata(controllerInstance: any): ControllerMetadata;
export declare function getRolesMetadata(target: any, propertyKey?: string): string[];
