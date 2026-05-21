import {
  createVercelBlobStorageProvider,
  type StorageProvider,
} from "@plotkeys/platform-integrations";

export type AssetStorageProviderName = "vercel_blob";

export function readDefaultAssetStorageProvider(
  env: Record<string, string | undefined> = process.env,
): AssetStorageProviderName {
  const provider = env.ASSET_STORAGE_PROVIDER ?? "vercel_blob";
  if (provider !== "vercel_blob") {
    throw new Error(`Unsupported asset storage provider: ${provider}`);
  }

  return provider;
}

export function createStorageProvider(
  provider: AssetStorageProviderName = readDefaultAssetStorageProvider(),
): StorageProvider {
  switch (provider) {
    case "vercel_blob":
      return createVercelBlobStorageProvider();
  }
}
