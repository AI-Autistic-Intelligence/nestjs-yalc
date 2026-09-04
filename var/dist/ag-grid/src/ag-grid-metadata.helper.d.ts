import { FieldMapper } from '@nestjs-yalc/interfaces/maps.interface';
import { ClassType } from '@nestjs-yalc/types';
import { ReturnTypeFuncValue } from '@nestjs/graphql';
import { RelationInfo } from "./ag-grid-factory.helper";
import { AgGridFieldMetadata, DstExtended, FieldAndFilterMapper } from './object.decorator';
export declare const columnConversion: (key: string, data: FieldMapper | {
    [key: string]: AgGridFieldMetadata;
} | undefined) => string;
export declare const getFieldMapperSrcByDst: (data: FieldMapper | undefined, dst: string) => string;
export declare const isSymbolic: (data: FieldMapper | undefined, key: string) => boolean;
export declare function getDestinationFieldName(dst: string | DstExtended): string;
export declare const objectToFieldMapper: (object: FieldMapper | FieldAndFilterMapper | ReturnTypeFuncValue | ClassType) => FieldAndFilterMapper;
export declare function isIFieldAndFilterMapper(val: FieldMapper | FieldAndFilterMapper): val is FieldAndFilterMapper;
export declare function getEntityRelations<Entity, DTO = Entity>(entityModel: ClassType<Entity>, dto?: ClassType<DTO>): RelationInfo[];
export declare function getTypeProperties<Entity>(entityModel: ClassType<Entity>): import("typeorm/metadata-args/ColumnMetadataArgs.js").ColumnMetadataArgs[];
export declare function getMappedTypeProperties<Entity>(entityModel: ClassType<Entity>): string[];
