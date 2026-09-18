"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Patch = exports.Delete = exports.Put = exports.Post = exports.Get = void 0;
exports.Controller = Controller;
exports.UseGuard = UseGuard;
exports.Roles = Roles;
exports.getControllerMetadata = getControllerMetadata;
exports.getRolesMetadata = getRolesMetadata;
const CONTROLLER_METADATA_KEY = Symbol('ferrox:controller');
const ROUTE_METADATA_KEY = Symbol('ferrox:routes');
const GUARDS_METADATA_KEY = Symbol('ferrox:guards');
const ROLES_METADATA_KEY = Symbol('ferrox:roles');
function Controller(prefix = '') {
    return (target) => {
        Reflect.defineMetadata(CONTROLLER_METADATA_KEY, prefix, target);
    };
}
function createRouteDecorator(method) {
    return (path = '') => {
        return (target, propertyKey) => {
            const routes = Reflect.getMetadata(ROUTE_METADATA_KEY, target.constructor) || [];
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
exports.Get = createRouteDecorator('GET');
exports.Post = createRouteDecorator('POST');
exports.Put = createRouteDecorator('PUT');
exports.Delete = createRouteDecorator('DELETE');
exports.Patch = createRouteDecorator('PATCH');
function UseGuard(...guards) {
    return (target, propertyKey) => {
        if (propertyKey) {
            const existingGuards = Reflect.getMetadata(GUARDS_METADATA_KEY, target.constructor, propertyKey) || [];
            Reflect.defineMetadata(GUARDS_METADATA_KEY, [...existingGuards, ...guards], target.constructor, propertyKey);
        }
        else {
            const existingGuards = Reflect.getMetadata(GUARDS_METADATA_KEY, target) || [];
            Reflect.defineMetadata(GUARDS_METADATA_KEY, [...existingGuards, ...guards], target);
        }
    };
}
function Roles(...roles) {
    return (target, propertyKey) => {
        if (propertyKey) {
            Reflect.defineMetadata(ROLES_METADATA_KEY, roles, target.constructor, propertyKey);
        }
        else {
            Reflect.defineMetadata(ROLES_METADATA_KEY, roles, target);
        }
    };
}
function getControllerMetadata(controllerInstance) {
    const target = controllerInstance.constructor;
    const prefix = Reflect.getMetadata(CONTROLLER_METADATA_KEY, target) || '';
    const classGuards = Reflect.getMetadata(GUARDS_METADATA_KEY, target) || [];
    const rawRoutes = Reflect.getMetadata(ROUTE_METADATA_KEY, target) || [];
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
function getRolesMetadata(target, propertyKey) {
    if (propertyKey) {
        return Reflect.getMetadata(ROLES_METADATA_KEY, target.constructor, propertyKey) || [];
    }
    return Reflect.getMetadata(ROLES_METADATA_KEY, target) || [];
}
//# sourceMappingURL=decorators.js.map