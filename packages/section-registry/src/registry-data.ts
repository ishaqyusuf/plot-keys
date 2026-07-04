import type { RegistryContextValue } from "./runtime-context";
import type { RenderMode } from "./types";

export type RegistryDataMode = "dev" | "live";

export type RegistryQueryScope = {
  dataMode: RegistryDataMode;
  pageKey?: string;
  renderMode: RenderMode;
  templateKey?: string;
  tenant: {
    companyId?: string;
    subdomain?: string;
  };
};

export type RegistryScopedQueryKey = readonly [
  "tenant-site",
  RegistryQueryScope,
  string,
  ...unknown[],
];

export type RegistryDataResolver<Input, Output> = (
  input: Input,
  scope: RegistryQueryScope,
) => Output | Promise<Output>;

export type RegistryQueryEndpoint<Input, Output> = {
  dev: RegistryDataResolver<Input, Output>;
  key: string;
  live: RegistryDataResolver<Input, Output>;
};

export type RegistryMutationEndpoint<Input, Output> = {
  dev?: RegistryDataResolver<Input, Output>;
  devDisabledMessage?: string;
  key: string;
  live: RegistryDataResolver<Input, Output>;
};

export class RegistryMutationDisabledError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RegistryMutationDisabledError";
  }
}

export function createRegistryQueryScope(
  ctx: Pick<
    RegistryContextValue,
    "isDevMode" | "page" | "renderMode" | "templateKey" | "tenant"
  >,
): RegistryQueryScope {
  return {
    dataMode: ctx.isDevMode ? "dev" : "live",
    pageKey: ctx.page.pageKey,
    renderMode: ctx.renderMode,
    templateKey: ctx.templateKey,
    tenant: {
      companyId: ctx.tenant?.companyId,
      subdomain: ctx.tenant?.subdomain,
    },
  };
}

export function createRegistryQueryKey(
  scope: RegistryQueryScope,
  endpointKey: string,
  input?: unknown,
): RegistryScopedQueryKey {
  return input === undefined
    ? ["tenant-site", scope, endpointKey]
    : ["tenant-site", scope, endpointKey, input];
}

export function createRegistryQueryOptions<Input, Output>(
  ctx: Parameters<typeof createRegistryQueryScope>[0],
  endpoint: RegistryQueryEndpoint<Input, Output>,
  input: Input,
) {
  const scope = createRegistryQueryScope(ctx);

  return {
    meta: { registryScope: scope },
    queryFn: () =>
      scope.dataMode === "dev"
        ? endpoint.dev(input, scope)
        : endpoint.live(input, scope),
    queryKey: createRegistryQueryKey(scope, endpoint.key, input),
  };
}

export function createRegistryMutationOptions<Input, Output>(
  ctx: Parameters<typeof createRegistryQueryScope>[0],
  endpoint: RegistryMutationEndpoint<Input, Output>,
) {
  const scope = createRegistryQueryScope(ctx);

  return {
    meta: { registryScope: scope },
    mutationFn: (input: Input) => {
      if (scope.dataMode === "dev") {
        if (endpoint.dev) return endpoint.dev(input, scope);

        throw new RegistryMutationDisabledError(
          endpoint.devDisabledMessage ??
            "This action is disabled while the tenant site is running outside live mode.",
        );
      }

      return endpoint.live(input, scope);
    },
    mutationKey: createRegistryQueryKey(scope, endpoint.key),
  };
}
