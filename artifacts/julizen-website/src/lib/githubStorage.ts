import { AdminProduct } from "./productStorage";

const GITHUB_API = "https://api.github.com";
const OWNER = "Joshbond123";
const REPO = "Julizen-Spice-Brand";
const STORE_FILE = "artifacts/julizen-website/public/data/store.json";
const IMAGES_DIR = "artifacts/julizen-website/public/images";

export interface StoreData {
  products: AdminProduct[];
  settings: {
    whatsapp_number: string;
    contact_email: string;
    contact_phone: string;
  };
}

function ghHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${STORE_FILE}`,
      { headers: ghHeaders(token) }
    );
    return res.ok;
  } catch {
    return false;
  }
}

interface FileContent {
  content: string;
  sha: string;
  encoding: string;
}

async function getFileSha(
  path: string,
  token: string
): Promise<{ sha: string; exists: boolean }> {
  const res = await fetch(
    `${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${path}`,
    { headers: ghHeaders(token) }
  );
  if (res.status === 404) return { sha: "", exists: false };
  if (!res.ok) throw new Error(`Failed to fetch file: ${res.status}`);
  const data = (await res.json()) as FileContent;
  return { sha: data.sha, exists: true };
}

function toBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function putFile(
  path: string,
  content: string,
  message: string,
  sha: string | undefined,
  token: string
): Promise<void> {
  const body: Record<string, unknown> = {
    message,
    content: toBase64(content),
  };
  if (sha) body.sha = sha;

  const res = await fetch(
    `${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${path}`,
    {
      method: "PUT",
      headers: ghHeaders(token),
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { message?: string }).message || `Failed to write file (${res.status})`
    );
  }
}

async function putBinaryFile(
  path: string,
  base64Content: string,
  message: string,
  token: string
): Promise<void> {
  const { sha, exists } = await getFileSha(path, token);
  const body: Record<string, unknown> = {
    message,
    content: base64Content,
  };
  if (exists) body.sha = sha;

  const res = await fetch(
    `${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${path}`,
    {
      method: "PUT",
      headers: ghHeaders(token),
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { message?: string }).message || `Failed to upload image (${res.status})`
    );
  }
}

export async function readStore(token: string): Promise<StoreData> {
  const res = await fetch(
    `${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${STORE_FILE}`,
    { headers: ghHeaders(token) }
  );
  if (!res.ok) throw new Error(`Failed to read store: ${res.status}`);
  const data = (await res.json()) as FileContent;
  const json = atob(data.content.replace(/\n/g, ""));
  return JSON.parse(json) as StoreData;
}

export async function writeStore(
  store: StoreData,
  message: string,
  token: string
): Promise<void> {
  const { sha } = await getFileSha(STORE_FILE, token);
  const json = JSON.stringify(store, null, 2);
  await putFile(STORE_FILE, json, message, sha || undefined, token);
}

export async function uploadImage(
  token: string,
  file: File
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const dataUrl = reader.result as string;
        const base64Match = dataUrl.match(/^data:[^;]+;base64,(.+)$/);
        if (!base64Match) {
          reject(new Error("Invalid image data"));
          return;
        }
        const base64Data = base64Match[1];

        const safeName = file.name
          .replace(/[^a-zA-Z0-9._-]/g, "-")
          .toLowerCase();
        const unique = Date.now().toString(36);
        const ext = safeName.split(".").pop() ?? "jpg";
        const baseName = safeName.replace(/\.[^.]+$/, "");
        const finalName = `${baseName}-${unique}.${ext}`;
        const repoPath = `${IMAGES_DIR}/${finalName}`;

        await putBinaryFile(
          repoPath,
          base64Data,
          `upload image: ${finalName}`,
          token
        );

        resolve(`/images/${finalName}`);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export function saveTokenToSession(token: string): void {
  sessionStorage.setItem("julizen_gh_token", token);
}

export function getTokenFromSession(): string | null {
  return sessionStorage.getItem("julizen_gh_token");
}

export function clearTokenFromSession(): void {
  sessionStorage.removeItem("julizen_gh_token");
}
