import { AdminProduct } from "./productStorage";

const GITHUB_API = "https://api.github.com";
const OWNER = "Joshbond123";
const REPO = "Julizen-Spice-Brand";
const STORE_FILE = "artifacts/julizen-website/public/data/store.json";
const IMAGES_DIR = "artifacts/julizen-website/public/images";

const PAT_STORAGE_KEY = "julizen_github_pat";
const SESSION_KEY = "julizen_admin_session";

export interface StoreSettings {
  whatsapp_number: string;
  contact_email: string;
  contact_phone: string;
  contact_phone_2: string;
}

export interface StoreData {
  admin_password_hash?: string;
  products: AdminProduct[];
  settings: StoreSettings;
}

export async function hashPassword(password: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(password)
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const computed = await hashPassword(password);
  return computed === hash;
}

export function savePat(token: string): void {
  localStorage.setItem(PAT_STORAGE_KEY, token);
}

export function getPat(): string | null {
  return localStorage.getItem(PAT_STORAGE_KEY);
}

export function deletePat(): void {
  localStorage.removeItem(PAT_STORAGE_KEY);
}

export function saveSession(): void {
  sessionStorage.setItem(SESSION_KEY, "1");
}

export function hasSession(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

function ghHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

export async function verifyPat(token: string): Promise<boolean> {
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

interface GHFile {
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
  if (!res.ok) throw new Error(`Failed to read file (${res.status})`);
  const data = (await res.json()) as GHFile;
  return { sha: data.sha, exists: true };
}

/**
 * Encode a UTF-8 string to base64 without corrupting multi-byte characters.
 * TextEncoder produces the correct UTF-8 bytes; we convert byte-by-byte to
 * a binary string that btoa can safely process.
 */
function encodeUtf8ToBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

/**
 * Decode base64 from the GitHub Contents API back to a UTF-8 string.
 *
 * WHY: atob() returns a Latin-1 binary string where each character represents
 * one raw byte. Multi-byte UTF-8 sequences (e.g. × = 0xC3 0x97) would be
 * returned as two Latin-1 characters (Ã + chr(0x97)), corrupting the text.
 * TextDecoder("utf-8") reads the byte array correctly.
 */
function decodeBase64ToUtf8(base64: string): string {
  const binaryString = atob(base64.replace(/\n/g, ""));
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new TextDecoder("utf-8").decode(bytes);
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
    content: encodeUtf8ToBase64(content),
  };
  if (sha) body.sha = sha;
  const res = await fetch(
    `${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${path}`,
    { method: "PUT", headers: ghHeaders(token), body: JSON.stringify(body) }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { message?: string }).message || `Write failed (${res.status})`
    );
  }
}

export async function readStore(token: string): Promise<StoreData> {
  const res = await fetch(
    `${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${STORE_FILE}`,
    { headers: ghHeaders(token) }
  );
  if (!res.ok) throw new Error(`Cannot read store.json (${res.status})`);
  const file = (await res.json()) as GHFile;
  const json = decodeBase64ToUtf8(file.content);
  return JSON.parse(json) as StoreData;
}

export async function writeStore(
  store: StoreData,
  message: string,
  token: string
): Promise<void> {
  const { sha } = await getFileSha(STORE_FILE, token);
  await putFile(
    STORE_FILE,
    JSON.stringify(store, null, 2),
    message,
    sha || undefined,
    token
  );
}

export async function uploadImage(token: string, file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const dataUrl = reader.result as string;
        const match = dataUrl.match(/^data:[^;]+;base64,(.+)$/);
        if (!match) { reject(new Error("Invalid image")); return; }
        const base64Data = match[1];
        const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
        const ext = safe.split(".").pop() ?? "jpg";
        const base = safe.replace(/\.[^.]+$/, "");
        const name = `${base}-${Date.now().toString(36)}.${ext}`;
        const path = `${IMAGES_DIR}/${name}`;
        const { sha, exists } = await getFileSha(path, token);
        const body: Record<string, unknown> = {
          message: `upload image: ${name}`,
          content: base64Data,
        };
        if (exists) body.sha = sha;
        const res = await fetch(
          `${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${path}`,
          { method: "PUT", headers: ghHeaders(token), body: JSON.stringify(body) }
        );
        if (!res.ok) {
          const e = await res.json().catch(() => ({}));
          reject(new Error((e as { message?: string }).message || "Upload failed"));
          return;
        }
        resolve(`/images/${name}`);
      } catch (e) { reject(e); }
    };
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsDataURL(file);
  });
}
