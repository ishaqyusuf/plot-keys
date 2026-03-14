import {
  createClient,
  type SupabaseClient,
  type SupabaseClientOptions,
} from "@supabase/supabase-js";

export type SupabaseEnv = {
  anonKey: string;
  serviceRoleKey?: string;
  url: string;
};

export type PublicSupabaseEnv = Pick<SupabaseEnv, "anonKey" | "url">;

export type CreateSupabaseClientOptions = {
  clientOptions?: SupabaseClientOptions<"public">;
};

function requireEnv(name: string, value: string | undefined): string {
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required Supabase environment variable: ${name}`);
  }

  return value;
}

export function readSupabaseEnv(
  env: Record<string, string | undefined> = process.env,
): SupabaseEnv {
  return {
    anonKey: requireEnv("SUPABASE_ANON_KEY", env.SUPABASE_ANON_KEY),
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
    url: requireEnv("SUPABASE_URL", env.SUPABASE_URL),
  };
}

export function readPublicSupabaseEnv(
  env: Record<string, string | undefined> = process.env,
): PublicSupabaseEnv {
  return {
    anonKey: requireEnv(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? env.SUPABASE_ANON_KEY,
    ),
    url: requireEnv(
      "NEXT_PUBLIC_SUPABASE_URL",
      env.NEXT_PUBLIC_SUPABASE_URL ?? env.SUPABASE_URL,
    ),
  };
}

export function createSupabaseClient(
  url: string,
  anonKey: string,
  options?: CreateSupabaseClientOptions,
): SupabaseClient {
  return createClient(url, anonKey, options?.clientOptions);
}

export function createSupabaseServerClient(
  env: PublicSupabaseEnv = readPublicSupabaseEnv(),
  options?: CreateSupabaseClientOptions,
): SupabaseClient {
  return createSupabaseClient(env.url, env.anonKey, options);
}

export function createSupabaseBrowserClient(
  env: PublicSupabaseEnv,
  options?: CreateSupabaseClientOptions,
): SupabaseClient {
  return createSupabaseClient(env.url, env.anonKey, options);
}

export function createSupabaseAdminClient(
  env: SupabaseEnv = readSupabaseEnv(),
  options?: CreateSupabaseClientOptions,
): SupabaseClient {
  return createClient(
    env.url,
    requireEnv("SUPABASE_SERVICE_ROLE_KEY", env.serviceRoleKey),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      ...options?.clientOptions,
    },
  );
}

export type TenantStorageObjectParams = {
  companyId: string;
  fileName: string;
  folder?: string;
};

export function buildTenantStorageObjectPath({
  companyId,
  fileName,
  folder = "uploads",
}: TenantStorageObjectParams): string {
  return [companyId, folder, fileName]
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0)
    .join("/");
}

export async function uploadTenantStorageObject(
  client: SupabaseClient,
  bucket: string,
  params: TenantStorageObjectParams & {
    contentType?: string;
    data: File | Blob | ArrayBuffer | Uint8Array;
    upsert?: boolean;
  },
) {
  const path = buildTenantStorageObjectPath(params);

  return client.storage.from(bucket).upload(path, params.data, {
    contentType: params.contentType,
    upsert: params.upsert,
  });
}

export function getTenantStoragePublicUrl(
  client: SupabaseClient,
  bucket: string,
  params: TenantStorageObjectParams,
): string {
  const path = buildTenantStorageObjectPath(params);

  return client.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
