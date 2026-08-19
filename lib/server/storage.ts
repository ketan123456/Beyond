import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

export type StoredDocument = {
  body: ReadableStream<Uint8Array>;
  writeHttpMetadata(headers: Headers): void;
};

export type DocumentStorage = {
  put(key: string, body: BodyInit, options: { httpMetadata?: { contentType?: string } }): Promise<void>;
  get(key: string): Promise<StoredDocument | null>;
  delete(key: string): Promise<void>;
};

let client: S3Client | undefined;

function getClient() {
  const endpoint = process.env.S3_ENDPOINT?.trim();
  const region = process.env.S3_REGION?.trim();
  const accessKeyId = process.env.S3_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY?.trim();
  if (!endpoint || !region || !accessKeyId || !secretAccessKey) return undefined;
  if (
    endpoint.includes("s3.example.com") ||
    accessKeyId === "your_s3_access_key" ||
    secretAccessKey === "your_s3_secret_key"
  ) {
    return undefined;
  }
  client ??= new S3Client({
    endpoint,
    region,
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
    credentials: { accessKeyId, secretAccessKey },
  });
  return client;
}

export function getDocumentStorage(): DocumentStorage | undefined {
  const activeClient = getClient();
  const bucket = process.env.S3_BUCKET?.trim();
  if (!activeClient || !bucket) return undefined;
  return {
    async put(key, body, options) {
      await activeClient.send(new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body as never,
        ContentType: options.httpMetadata?.contentType,
      }));
    },
    async get(key) {
      const result = await activeClient.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
      if (!result.Body) return null;
      const body = await result.Body.transformToWebStream();
      return {
        body,
        writeHttpMetadata(headers) {
          if (result.ContentType) headers.set("content-type", result.ContentType);
          if (result.ContentLength) headers.set("content-length", String(result.ContentLength));
        },
      };
    },
    async delete(key) {
      await activeClient.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
    },
  };
}
