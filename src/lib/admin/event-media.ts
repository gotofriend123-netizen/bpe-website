import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const EVENT_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "events");
const EVENT_UPLOAD_BASE = "/uploads/events";
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

const MIME_TO_EXTENSION: Record<string, string> = {
  "image/avif": ".avif",
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const ALLOWED_EXTENSIONS = new Set([".avif", ".jpg", ".jpeg", ".png", ".webp"]);

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function resolveFileExtension(file: File) {
  const fromMime = MIME_TO_EXTENSION[file.type];
  const fromName = path.extname(file.name || "").toLowerCase();

  if (fromMime) {
    return fromMime;
  }

  if (ALLOWED_EXTENSIONS.has(fromName)) {
    return fromName === ".jpeg" ? ".jpg" : fromName;
  }

  throw new Error("Please upload a JPG, PNG, WEBP, or AVIF image.");
}

export async function saveEventImageUpload(
  file: File,
  kind: "poster" | "cover",
  slugSeed: string,
) {
  if (!file.size) {
    throw new Error("Please choose an image file before publishing.");
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("Event images must be 10 MB or smaller.");
  }

  const extension = resolveFileExtension(file);
  const safeSlug = slugify(slugSeed) || "event";
  const fileName = `${safeSlug}-${kind}-${randomUUID().slice(0, 8)}${extension}`;

  await mkdir(EVENT_UPLOAD_DIR, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(EVENT_UPLOAD_DIR, fileName), buffer);

  return `${EVENT_UPLOAD_BASE}/${fileName}`;
}
