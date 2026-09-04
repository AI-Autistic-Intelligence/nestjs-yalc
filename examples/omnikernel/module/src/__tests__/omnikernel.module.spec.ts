import { describe, expect, it, jest } from '@jest/globals';
import 'reflect-metadata';
import { OmniKernelQueryService } from '../omnikernel.query.service.js';

import * as OmniNamedBackend from '../omni-named.backend.js';
import * as OmniRecordBackend from '../omni-record.backend.js';
import * as OmniRelationBackend from '../omni-relation.backend.js';
import * as OmniCollectionBackend from '../omni-collection.backend.js';
import * as OmniDocumentBackend from '../omni-document.backend.js';
import * as OmniExternalRefBackend from '../omni-external-ref.backend.js';

const omniNamedBackendProvidersFactory = jest.spyOn(OmniNamedBackend as any, 'omniNamedBackendProvidersFactory').mockReturnValue({ providers: ['named-backend'] });
const omniRecordBackendProvidersFactory = jest.spyOn(OmniRecordBackend as any, 'omniRecordBackendProvidersFactory').mockReturnValue({ providers: ['record-backend'] });
const omniRelationBackendProvidersFactory = jest.spyOn(OmniRelationBackend as any, 'omniRelationBackendProvidersFactory').mockReturnValue({ providers: ['relation-backend'] });
const omniCollectionBackendProvidersFactory = jest.spyOn(OmniCollectionBackend as any, 'omniCollectionBackendProvidersFactory').mockReturnValue({ providers: ['collection-backend'] });
const omniDocumentBackendProvidersFactory = jest.spyOn(OmniDocumentBackend as any, 'omniDocumentBackendProvidersFactory').mockReturnValue({ providers: ['document-backend'] });
const omniExternalRefBackendProvidersFactory = jest.spyOn(OmniExternalRefBackend as any, 'omniExternalRefBackendProvidersFactory').mockReturnValue({ providers: ['external-ref-backend'] });

import { OmniKernelModule } from '../omnikernel.module.js';

describe('OmniKernelModule', () => {
  it('registers only backend substrate providers', () => {
    const module = OmniKernelModule.register('test');

    expect(module).toBeDefined();
    expect(omniNamedBackendProvidersFactory).toHaveBeenCalledWith('test');
    expect(module.providers).toEqual(
      expect.arrayContaining([
        'named-backend',
        'record-backend',
        'relation-backend',
        'collection-backend',
        'document-backend',
        'external-ref-backend',
        expect.objectContaining({ provide: OmniKernelQueryService }),
      ]),
    );
    expect(module.controllers).toBeUndefined();
  });
});
