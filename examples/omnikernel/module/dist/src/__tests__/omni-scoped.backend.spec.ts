import { describe, expect, it } from "@jest/globals";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { OmniNamedEntity } from '../base/omni-named.entity.js';
import { OmniRecordEntity } from '../base/omni-record.entity.js';
import { OmniRelationEntity } from '../base/omni-relation.entity.js';
import { OmniCollectionEntity } from '../omni-collection.entity.js';
import { OmniDocumentEntity } from '../omni-document.entity.js';
import { OmniExternalRefEntity } from '../base/omni-external-ref.entity.js';
import { OmniExternalRefService } from '../omni-external-ref.service.js';
import { OmniRelationService } from '../omni-relation.service.js';
import { OmniScopedService } from '../omni-scoped.service.js';
import { normalizeOmniKernelRegistrationOptions } from '../omni-scope.js';
import { omniScopedBackendProvidersFactory, omniBackendServiceToken } from '../omni-scoped.backend.js';
import { omniNamedBackendProvidersFactory } from '../omni-named.backend.js';
import { omniRecordBackendProvidersFactory } from '../omni-record.backend.js';
import { omniRelationBackendProvidersFactory } from '../omni-relation.backend.js';
import { omniCollectionBackendProvidersFactory } from '../omni-collection.backend.js';
import { omniDocumentBackendProvidersFactory } from '../omni-document.backend.js';
import { omniExternalRefBackendProvidersFactory } from '../omni-external-ref.backend.js';

const scope = {
  scopeId: "scope-alpha",
  cacheKey: (key: string) => `scope-alpha:${key}`,
};
const options = normalizeOmniKernelRegistrationOptions({
  dbConnection: "default",
  relationKinds: ["blocks"],
});

const repositoryFor = (target: unknown) => ({ target });

const factoryProvider = (providers: unknown[]) =>
  providers.find(
    (provider) =>
      typeof provider === "object" &&
      provider !== null &&
      "useFactory" in provider,
  ) as { useFactory: (...dependencies: unknown[]) => unknown };

describe("Omni scoped backend providers", () => {
  it("builds request-scoped generic services for every ordinary resource", () => {
    const cases = [
      [omniNamedBackendProvidersFactory, OmniNamedEntity],
      [omniRecordBackendProvidersFactory, OmniRecordEntity],
      [omniCollectionBackendProvidersFactory, OmniCollectionEntity],
      [omniDocumentBackendProvidersFactory, OmniDocumentEntity],
    ] as const;

    for (const [factory, entity] of cases) {
      const backend = factory("default");
      const service = factoryProvider(backend.providers).useFactory(
        repositoryFor(entity),
        scope,
        options,
      );
      expect(service).toBeInstanceOf(OmniScopedService);
    }
  });

  it("builds the relation service with a scoped record dependency", () => {
    const backend = omniRelationBackendProvidersFactory("default");
    const service = factoryProvider(backend.providers).useFactory(
      repositoryFor(OmniRelationEntity),
      scope,
      options,
      repositoryFor(OmniRecordEntity),
    );

    expect(service).toBeInstanceOf(OmniRelationService);
  });

  it("builds the external-reference service and exposes its service alias", () => {
    const backend = omniExternalRefBackendProvidersFactory("default");
    const service = factoryProvider(backend.providers).useFactory(
      repositoryFor(OmniExternalRefEntity),
      scope,
      options,
    );

    expect(service).toBeInstanceOf(OmniExternalRefService);
    expect(backend.providers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ provide: OmniExternalRefService }),
      ]),
    );
    expect(omniBackendServiceToken(OmniExternalRefService)).toBe(
      "OmniExternalRefService",
    );
  });

  it("uses the scope-prefixed cache key in the generated request loader", () => {
    const backend = omniScopedBackendProvidersFactory({
      entityModel: OmniRecordEntity,
      dbConnection: "default",
      createService: (repository, resolvedScope) =>
        new OmniScopedService(repository, resolvedScope),
    });
    const loaderProvider = backend.providers.find(
      (provider) =>
        typeof provider === "object" &&
        provider !== null &&
        "useFactory" in provider &&
        provider !== factoryProvider(backend.providers),
    ) as { useFactory: (...dependencies: unknown[]) => unknown };
    const service = new OmniScopedService(
      repositoryFor(OmniRecordEntity) as never,
      scope,
    );

    expect(
      loaderProvider.useFactory(service, scope, new EventEmitter2()),
    ).toBeDefined();
  });
});
