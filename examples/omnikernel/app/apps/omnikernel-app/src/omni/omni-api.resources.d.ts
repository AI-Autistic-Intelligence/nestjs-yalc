import { OmniCollectionEntity, OmniDocumentEntity, OmniExternalRefEntity, OmniNamedEntity, OmniRecordEntity, OmniRelationEntity } from '@nestjs-yalc/omnikernel-module';
export declare const omniNamedResource: import("@nestjs-yalc/crud-gen").ICrudGenResourceFactoryResult<OmniNamedEntity>;
export declare const omniRecordResource: import("@nestjs-yalc/crud-gen").ICrudGenResourceFactoryResult<OmniRecordEntity>;
export declare const omniDocumentResource: import("@nestjs-yalc/crud-gen").ICrudGenResourceFactoryResult<OmniDocumentEntity>;
export declare const omniCollectionResource: import("@nestjs-yalc/crud-gen").ICrudGenResourceFactoryResult<OmniCollectionEntity>;
export declare const omniRelationResource: import("@nestjs-yalc/crud-gen").ICrudGenResourceFactoryResult<OmniRelationEntity>;
export declare const omniExternalRefResource: import("@nestjs-yalc/crud-gen").ICrudGenResourceFactoryResult<OmniExternalRefEntity>;
export declare const omniApiProviders: import("@nestjs/common").Provider[];
export declare const omniApiControllers: import("@nestjs-yalc/types").ClassType<any>[];
