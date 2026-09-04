import crypto from "crypto";

export interface ImageKitUploadResponse {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl?: string;
  height?: number;
  width?: number;
  size?: number;
  filePath?: string;
}

export interface ImageKitAuthParams {
  token: string;
  expire: number;
  signature: string;
  publicKey: string;
  urlEndpoint: string;
}

export function isImageKitConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY &&
      process.env.IMAGEKIT_PRIVATE_KEY &&
      process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
  );
}

export function getImageKitAuthParams(): ImageKitAuthParams {
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "";
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || "";
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "";

  const token = crypto.randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 2400;

  const signature = crypto
    .createHmac("sha1", privateKey)
    .update(token + expire)
    .digest("hex");

  return {
    token,
    expire,
    signature,
    publicKey,
    urlEndpoint,
  };
}

export async function uploadToImageKit({
  file,
  fileName,
  folder = "/uploads",
  tags = [],
}: {
  file: string | Buffer;
  fileName: string;
  folder?: string;
  tags?: string[];
}): Promise<ImageKitUploadResponse> {
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  if (!publicKey || !privateKey || !urlEndpoint) {
    throw new Error(
      "ImageKit credentials missing. Please set NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT in .env.local"
    );
  }

  const formData = new FormData();

  if (Buffer.isBuffer(file)) {
    const blob = new Blob([new Uint8Array(file)]);
    formData.append("file", blob, fileName);
  } else {
    formData.append("file", file);
  }

  formData.append("fileName", fileName);
  formData.append("useUniqueFileName", "true");
  if (folder) formData.append("folder", folder);
  if (tags.length > 0) formData.append("tags", tags.join(","));

  const authHeader = Buffer.from(`${privateKey}:`).toString("base64");

  const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    headers: {
      Authorization: `Basic ${authHeader}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ImageKit upload failed (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  return {
    fileId: result.fileId,
    name: result.name,
    url: result.url,
    thumbnailUrl: result.thumbnailUrl,
    height: result.height,
    width: result.width,
    size: result.size,
    filePath: result.filePath,
  };
}

export async function deleteFromImageKit(fileId: string): Promise<boolean> {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error("IMAGEKIT_PRIVATE_KEY is missing in environment variables.");
  }

  const authHeader = Buffer.from(`${privateKey}:`).toString("base64");

  const response = await fetch(`https://api.imagekit.io/v1/files/${fileId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Basic ${authHeader}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ImageKit deletion failed (${response.status}): ${errorText}`);
  }

  return true;
}

export async function deleteFromImageKitByUrl(imageUrl: string): Promise<boolean> {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  if (!privateKey || !urlEndpoint) return false;

  if (!imageUrl.includes("ik.imagekit.io")) return false;

  try {
    const url = new URL(imageUrl);
    const pathSegments = url.pathname.split("/");
    const filePath = "/" + pathSegments.slice(2).join("/");
    const fileName = pathSegments[pathSegments.length - 1];

    if (!fileName) return false;

    const authHeader = Buffer.from(`${privateKey}:`).toString("base64");

    const searchUrl = new URL("https://api.imagekit.io/v1/files");
    searchUrl.searchParams.set("searchQuery", `name="${fileName}"`);

    const searchRes = await fetch(searchUrl.toString(), {
      headers: { Authorization: `Basic ${authHeader}` },
    });

    if (!searchRes.ok) return false;

    const files = await searchRes.json();
    if (!Array.isArray(files) || files.length === 0) return false;

    const match = files.find(
      (f: { filePath?: string }) => f.filePath === filePath
    ) || files[0];

    if (!match?.fileId) return false;

    return await deleteFromImageKit(match.fileId);
  } catch {
    return false;
  }
}
