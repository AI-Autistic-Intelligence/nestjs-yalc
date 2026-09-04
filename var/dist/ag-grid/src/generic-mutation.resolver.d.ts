import { ClassType } from "@nestjs-yalc/types";
import { GenericResolver, GenericResolverMutationCreateOptions, GenericResolverOptions, GenericResolverQueryOptions } from "./generic-resolver.type";
export declare function defineCreateMutation<Entity extends Record<string, any>>(queryName: string, returnType: ClassType, resolver: ClassType<GenericResolver>, options: GenericResolverOptions<Entity>, methodOptions: GenericResolverMutationCreateOptions<Entity>): void;
export declare function defineUpdateMutation<Entity extends Record<string, any>>(queryName: string, returnType: ClassType, resolver: ClassType<GenericResolver>, options: GenericResolverOptions<Entity>, methodOptions: GenericResolverQueryOptions): void;
export declare function defineDeleteMutation<Entity extends Record<string, any>>(queryName: string, returnType: ClassType, resolver: ClassType<GenericResolver>, options: GenericResolverOptions<Entity>, methodOptions: GenericResolverQueryOptions): void;
