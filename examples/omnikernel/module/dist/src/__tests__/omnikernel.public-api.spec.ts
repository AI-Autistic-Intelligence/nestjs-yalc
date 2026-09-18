import { describe, expect, it } from '@jest/globals';
import 'reflect-metadata';
import { OmniCollectionKind } from '../omni-collection-kind.enum.js';
import { OmniDocumentKind } from '../omni-document-kind.enum.js';
import { OmniRecordStatus } from '../omni-record-status.enum.js';
import { OmniRelationKind } from '../omni-relation-kind.enum.js';
import { OmniRelationStatus } from '../omni-relation-status.enum.js';

import * as namedDto from '../omni-named.dto.js';
import * as recordDto from '../omni-record.dto.js';
import * as collectionDto from '../omni-collection.dto.js';
import * as relationDto from '../omni-relation.dto.js';
import * as externalRefDto from '../omni-external-ref.dto.js';
import * as documentDto from '../omni-document.dto.js';
import { OmniCollectionEntity } from '../omni-collection.entity.js';
import { OmniCollectionService } from '../omni-collection.service.js';
import { OmniDocumentEntity } from '../omni-document.entity.js';
import { OmniDocumentService } from '../omni-document.service.js';
import { OmniExternalRefInternalType } from '../omni-external-ref-internal-type.enum.js';
import { OmniExternalRefService } from '../omni-external-ref.service.js';
import * as relationSemantics from '../omni-relation-semantics.js';
import { OmniKernelQueryService } from '../omnikernel.query.service.js';
import { omniCollectionBackendProvidersFactory } from '../omni-collection.backend.js';
import { omniNamedBackendProvidersFactory } from '../omni-named.backend.js';
import { omniRecordBackendProvidersFactory } from '../omni-record.backend.js';
import { omniRelationBackendProvidersFactory } from '../omni-relation.backend.js';
import { omniExternalRefBackendProvidersFactory } from '../omni-external-ref.backend.js';
import { omniDocumentBackendProvidersFactory } from '../omni-document.backend.js';
import * as omnikernelPublicApi from '../index.js';

describe('OmniKernel public API', () => {
  it('copies data through DTO constructors', () => {
    const named = new namedDto.OmniNamedType({
      guid: '6c1bfae7-b56c-4537-a5c7-98c84ce2d23a',
      title: 'Named',
      slug: 'named',
    });
    const record = new recordDto.OmniRecordType({
      guid: 'b7df87c7-b8b8-43a3-99c0-811024a48b39',
      title: 'Record',
      kind: 'generic',
      status: OmniRecordStatus.Active,
      payload: { ok: true },
    });
    const collection = new collectionDto.OmniCollectionType({
      guid: '0f7f6978-66f2-4d96-a7f3-a0ecf399f2e2',
      title: 'Collection',
      kind: OmniCollectionKind.Collection,
      status: OmniRecordStatus.Active,
      collectionKind: OmniCollectionKind.Folder,
      summary: 'Container',
    });
    const relation = new relationDto.OmniRelationType({
      guid: '5bba1944-1a52-4918-ba54-453e09d3d9b3',
      sourceRecordId: 'b7df87c7-b8b8-43a3-99c0-811024a48b39',
      targetRecordId: '6c1bfae7-b56c-4537-a5c7-98c84ce2d23a',
      kind: OmniRelationKind.Contains,
      status: OmniRelationStatus.Active,
    });
    const externalRef = new externalRefDto.OmniExternalRefType({
      guid: '47eaf320-9fbe-4f2e-9a0a-c2c4cbdb2d9e',
      internalType: OmniExternalRefInternalType.Document,
      internalId: 'b7df87c7-b8b8-43a3-99c0-811024a48b39',
      provider: 'github',
      externalId: '123',
    });
    const document = new documentDto.OmniDocumentType({
      guid: 'ebf2fd92-9271-4cb7-b5a8-a7ce0105dff5',
      title: 'Document',
      kind: OmniDocumentKind.Document,
      status: OmniRecordStatus.Active,
      documentKind: OmniDocumentKind.Document,
      content: 'Body',
    });

    expect(named.title).toBe('Named');
    expect(record.payload).toEqual({ ok: true });
    expect(collection.collectionKind).toBe(OmniCollectionKind.Folder);
    expect(relation.kind).toBe(OmniRelationKind.Contains);
    expect(externalRef.provider).toBe('github');
    expect(document.documentKind).toBe(OmniDocumentKind.Document);
  });

  it('exposes generated GraphQL input types', () => {
    expect(new namedDto.OmniNamedCreateInput()).toBeInstanceOf(
      namedDto.OmniNamedCreateInput,
    );
    expect(new namedDto.OmniNamedCondition()).toBeInstanceOf(
      namedDto.OmniNamedCondition,
    );
    expect(new namedDto.OmniNamedUpdateInput()).toBeInstanceOf(
      namedDto.OmniNamedUpdateInput,
    );

    expect(new recordDto.OmniRecordCreateInput()).toBeInstanceOf(
      recordDto.OmniRecordCreateInput,
    );
    expect(new recordDto.OmniRecordCondition()).toBeInstanceOf(
      recordDto.OmniRecordCondition,
    );
    expect(new recordDto.OmniRecordUpdateInput()).toBeInstanceOf(
      recordDto.OmniRecordUpdateInput,
    );

    expect(new collectionDto.OmniCollectionCreateInput()).toBeInstanceOf(
      collectionDto.OmniCollectionCreateInput,
    );
    expect(new collectionDto.OmniCollectionCondition()).toBeInstanceOf(
      collectionDto.OmniCollectionCondition,
    );
    expect(new collectionDto.OmniCollectionUpdateInput()).toBeInstanceOf(
      collectionDto.OmniCollectionUpdateInput,
    );

    expect(new relationDto.OmniRelationCreateInput()).toBeInstanceOf(
      relationDto.OmniRelationCreateInput,
    );
    expect(new relationDto.OmniRelationCondition()).toBeInstanceOf(
      relationDto.OmniRelationCondition,
    );
    expect(new relationDto.OmniRelationUpdateInput()).toBeInstanceOf(
      relationDto.OmniRelationUpdateInput,
    );

    expect(new externalRefDto.OmniExternalRefCreateInput()).toBeInstanceOf(
      externalRefDto.OmniExternalRefCreateInput,
    );
    expect(new externalRefDto.OmniExternalRefCondition()).toBeInstanceOf(
      externalRefDto.OmniExternalRefCondition,
    );
    expect(new externalRefDto.OmniExternalRefUpdateInput()).toBeInstanceOf(
      externalRefDto.OmniExternalRefUpdateInput,
    );

    expect(new documentDto.OmniDocumentCreateInput()).toBeInstanceOf(
      documentDto.OmniDocumentCreateInput,
    );
    expect(new documentDto.OmniDocumentCondition()).toBeInstanceOf(
      documentDto.OmniDocumentCondition,
    );
    expect(new documentDto.OmniDocumentUpdateInput()).toBeInstanceOf(
      documentDto.OmniDocumentUpdateInput,
    );
  });

  it('builds backend provider configs for every public backend factory', () => {
    const named = omniNamedBackendProvidersFactory('db');
    const record = omniRecordBackendProvidersFactory('db');
    const collection = omniCollectionBackendProvidersFactory('db');
    const relation = omniRelationBackendProvidersFactory('db');
    const externalRef = omniExternalRefBackendProvidersFactory('db');
    const document = omniDocumentBackendProvidersFactory('db');

    expect(named.repository).toBeDefined();
    expect(record.repository).toBeDefined();
    expect(collection.repository).toBeDefined();
    expect(relation.repository).toBeDefined();
    expect(externalRef.repository).toBeDefined();
    expect(document.repository).toBeDefined();
    expect(record.providers.length).toBeGreaterThan(0);
    expect(collection.providers.length).toBeGreaterThan(0);
    expect(document.providers.length).toBeGreaterThan(0);
    expect(
      collection.providers.some(
        (provider) =>
          typeof provider === 'object' &&
          provider !== null &&
          'provide' in provider &&
          provider.provide === OmniCollectionService,
      ),
    ).toBe(true);
    expect(
      document.providers.some(
        (provider) =>
          typeof provider === 'object' &&
          provider !== null &&
          'provide' in provider &&
          provider.provide === OmniDocumentService,
        ),
    ).toBe(true);
    expect(
      externalRef.providers.some(
        (provider) =>
          typeof provider === 'object' &&
          provider !== null &&
          'provide' in provider &&
          provider.provide === OmniExternalRefService,
      ),
    ).toBe(true);
    expect(OmniCollectionEntity).toBe(omnikernelPublicApi.OmniCollectionEntity);
    expect(OmniDocumentEntity).toBe(omnikernelPublicApi.OmniDocumentEntity);
  });

  it('re-exports the documented OmniKernel surface from index.ts', () => {
    expect(omnikernelPublicApi.OmniKernelModule).toBeDefined();
    expect(omnikernelPublicApi.OmniNamedType).toBe(namedDto.OmniNamedType);
    expect(omnikernelPublicApi.OmniRecordType).toBe(recordDto.OmniRecordType);
    expect(omnikernelPublicApi.OmniCollectionType).toBe(
      collectionDto.OmniCollectionType,
    );
    expect(omnikernelPublicApi.OmniRelationType).toBe(
      relationDto.OmniRelationType,
    );
    expect(omnikernelPublicApi.OmniExternalRefType).toBe(
      externalRefDto.OmniExternalRefType,
    );
    expect(omnikernelPublicApi.OmniDocumentType).toBe(
      documentDto.OmniDocumentType,
    );
    expect(omnikernelPublicApi.omniDocumentBackendProvidersFactory).toBe(
      omniDocumentBackendProvidersFactory,
    );
    expect(omnikernelPublicApi.omniCollectionBackendProvidersFactory).toBe(
      omniCollectionBackendProvidersFactory,
    );
    expect(omnikernelPublicApi.omniNamedBackendProvidersFactory).toBe(
      omniNamedBackendProvidersFactory,
    );
    expect(omnikernelPublicApi.omniRecordBackendProvidersFactory).toBe(
      omniRecordBackendProvidersFactory,
    );
    expect(omnikernelPublicApi.omniRelationBackendProvidersFactory).toBe(
      omniRelationBackendProvidersFactory,
    );
    expect(omnikernelPublicApi.omniExternalRefBackendProvidersFactory).toBe(
      omniExternalRefBackendProvidersFactory,
    );
    expect(omnikernelPublicApi.isAllowedOmniRelation).toBe(
      relationSemantics.isAllowedOmniRelation,
    );
    expect(omnikernelPublicApi.OmniExternalRefInternalType).toBe(
      OmniExternalRefInternalType,
    );
    expect(omnikernelPublicApi.OmniKernelQueryService).toBe(
      OmniKernelQueryService,
    );
  });
});
