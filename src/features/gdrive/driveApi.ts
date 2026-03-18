import { getValidAccessToken } from "./auth";

const FILES_API = "https://www.googleapis.com/drive/v3/files";
const UPLOAD_API = "https://www.googleapis.com/upload/drive/v3/files";

export interface DriveFile {
  id: string;
  name: string;
  modifiedTime: string;
}

export async function listProjectFiles(): Promise<DriveFile[]> {
  const token = await getValidAccessToken();
  const params = new URLSearchParams({
    q: "name contains '.transcription.zip' and trashed = false",
    fields: "files(id,name,modifiedTime)",
    orderBy: "modifiedTime desc",
  });

  const res = await fetch(`${FILES_API}?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to list Drive files");
  const data = await res.json();
  return data.files as DriveFile[];
}

export async function uploadProject(
  name: string,
  zipBlob: Blob,
  existingFileId?: string
): Promise<string> {
  const token = await getValidAccessToken();
  const metadata = {
    name: `${name}.transcription.zip`,
    mimeType: "application/zip",
  };

  const form = new FormData();
  form.append(
    "metadata",
    new Blob([JSON.stringify(metadata)], { type: "application/json" })
  );
  form.append("file", zipBlob);

  const url = existingFileId
    ? `${UPLOAD_API}/${existingFileId}?uploadType=multipart`
    : `${UPLOAD_API}?uploadType=multipart`;

  const res = await fetch(url, {
    method: existingFileId ? "PATCH" : "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  if (!res.ok) throw new Error("Failed to upload project to Drive");
  const data = await res.json();
  return data.id as string;
}

export async function downloadProject(fileId: string): Promise<Blob> {
  const token = await getValidAccessToken();
  const res = await fetch(`${FILES_API}/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to download project from Drive");
  return res.blob();
}

export async function findProjectByName(
  name: string
): Promise<string | undefined> {
  const token = await getValidAccessToken();
  const params = new URLSearchParams({
    q: `name = '${name}.transcription.zip' and trashed = false`,
    fields: "files(id)",
  });

  const res = await fetch(`${FILES_API}?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return undefined;
  const data = await res.json();
  return (data.files?.[0]?.id as string) ?? undefined;
}
