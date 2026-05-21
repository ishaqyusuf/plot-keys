import { del, list, put } from "@vercel/blob";

import type {
  StorageProvider,
  StoragePutInput,
  StoragePutResult,
  StorageReadResult,
  StorageUploadOptions,
  StorageUploadResult,
} from "./storage";

function toPutBody(
  body: StoragePutInput["body"] | File | Blob,
): Parameters<typeof put>[1] {
  return body as Parameters<typeof put>[1];
}

export class VercelBlobStorageProvider implements StorageProvider {
  readonly name = "vercel_blob";

  getPublicUrl(_bucket: string, path: string): string {
    return path;
  }

  async upload(
    _bucket: string,
    path: string,
    data: File | Blob | ArrayBuffer | Uint8Array,
    options?: StorageUploadOptions,
  ): Promise<StorageUploadResult> {
    const blob = await put(path, toPutBody(data), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: options?.upsert ?? false,
      contentType: options?.contentType,
    });

    return { path: blob.pathname, publicUrl: blob.url };
  }

  async put(input: StoragePutInput): Promise<StoragePutResult> {
    const blob = await put(input.key, toPutBody(input.body), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: input.contentType,
    });

    return {
      bucket: input.bucket,
      key: blob.pathname,
      publicUrl: blob.url,
    };
  }

  async read(input: { key: string }): Promise<StorageReadResult> {
    const match = await list({ prefix: input.key, limit: 1 });
    const blob = match.blobs.find((item) => item.pathname === input.key);
    if (!blob) throw new Error(`Vercel Blob object not found: ${input.key}`);

    const response = await fetch(blob.url);
    if (!response.ok || !response.body) {
      throw new Error(`Failed to read Vercel Blob object: ${input.key}`);
    }

    return {
      body: response.body,
      contentType: response.headers.get("content-type") ?? undefined,
    };
  }

  async copy(input: { fromKey: string; toKey: string }): Promise<void> {
    const source = await this.read({ key: input.fromKey });
    await this.put({
      body: source.body,
      contentType: source.contentType ?? "application/octet-stream",
      key: input.toKey,
    });
  }

  async delete(_bucket: string, path: string): Promise<void> {
    await del(path);
  }
}

export function createVercelBlobStorageProvider() {
  return new VercelBlobStorageProvider();
}
