/**
 * Routing & Guard Decorators for Ferrox-Node Standalone Framework
 */

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

const CONTROLLER_METADATA_KEY = Symbol('ferrox:controller');
const ROUTE_METADATA_KEY = Symbol('ferrox:routes');
const GUARDS_METADATA_KEY = Symbol('ferrox:guards');
const ROLES_METADATA_KEY = Symbol('ferrox:roles');

export function Controller(prefix: string = ''): ClassDecorator {
  return (target: any) => {
    Reflect.defineMetadata(CONTROLLER_METADATA_KEY, prefix, target);
  };
}

function createRouteDecorator(method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH') {
  return (path: string = ''): MethodDecorator => {
    return (target: any, propertyKey: string | symbol) => {
      const routes: RouteMetadata[] = Reflect.getMetadata(ROUTE_METADATA_KEY, target.constructor) || [];
      routes.push({
        method,
        path,
        handlerName: String(propertyKey),
        guards: [],
      });
      Reflect.defineMetadata(ROUTE_METADATA_KEY, routes, target.constructor);
    };
  };
}

export const Get = createRouteDecorator('GET');
export const Post = createRouteDecorator('POST');
export const Put = createRouteDecorator('PUT');
export const Delete = createRouteDecorator('DELETE');
export const Patch = createRouteDecorator('PATCH');

export function UseGuard(...guards: any[]): MethodDecorator & ClassDecorator {
  return (target: any, propertyKey?: string | symbol) => {
    if (propertyKey) {
      // Method guard
      const existingGuards = Reflect.getMetadata(GUARDS_METADATA_KEY, target.constructor, propertyKey) || [];
      Reflect.defineMetadata(GUARDS_METADATA_KEY, [...existingGuards, ...guards], target.constructor, propertyKey);
    } else {
      // Class guard
      const existingGuards = Reflect.getMetadata(GUARDS_METADATA_KEY, target) || [];
      Reflect.defineMetadata(GUARDS_METADATA_KEY, [...existingGuards, ...guards], target);
    }
  };
}

export function Roles(...roles: string[]): MethodDecorator & ClassDecorator {
  return (target: any, propertyKey?: string | symbol) => {
    if (propertyKey) {
      Reflect.defineMetadata(ROLES_METADATA_KEY, roles, target.constructor, propertyKey);
    } else {
      Reflect.defineMetadata(ROLES_METADATA_KEY, roles, target);
    }
  };
}

export function getControllerMetadata(controllerInstance: any): ControllerMetadata {
  const target = controllerInstance.constructor;
  const prefix = Reflect.getMetadata(CONTROLLER_METADATA_KEY, target) || '';
  const classGuards = Reflect.getMetadata(GUARDS_METADATA_KEY, target) || [];
  const rawRoutes: RouteMetadata[] = Reflect.getMetadata(ROUTE_METADATA_KEY, target) || [];

  const routes = rawRoutes.map((r) => {
    const methodGuards = Reflect.getMetadata(GUARDS_METADATA_KEY, target, r.handlerName) || [];
    return {
      ...r,
      guards: [...classGuards, ...methodGuards],
    };
  });

  return {
    prefix,
    guards: classGuards,
    routes,
  };
}

export function getRolesMetadata(target: any, propertyKey?: string): string[] {
  if (propertyKey) {
    return Reflect.getMetadata(ROLES_METADATA_KEY, target.constructor, propertyKey) || [];
  }
  return Reflect.getMetadata(ROLES_METADATA_KEY, target) || [];
}
