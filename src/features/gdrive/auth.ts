const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
const CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET as string;
const SCOPE = "https://www.googleapis.com/auth/drive.file";
const AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";

// Use Vite's BASE_URL so redirect matches in both dev and GitHub Pages
const REDIRECT_URI = window.location.origin + import.meta.env.BASE_URL;

const LS = {
  ACCESS_TOKEN: "transcribe_gdrive_access_token",
  REFRESH_TOKEN: "transcribe_gdrive_refresh_token",
  TOKEN_EXPIRY: "transcribe_gdrive_token_expiry",
} as const;

const SS_CODE_VERIFIER = "transcribe_gdrive_code_verifier";

// ─── PKCE helpers ─────────────────────────────────────────────────────────────

function base64urlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let str = "";
  for (const byte of bytes) str += String.fromCharCode(byte);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function generateCodeVerifier(): string {
  const array = new Uint8Array(96);
  crypto.getRandomValues(array);
  return base64urlEncode(array.buffer);
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return base64urlEncode(hash);
}

// ─── Token storage ────────────────────────────────────────────────────────────

function storeTokens(data: {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}): void {
  localStorage.setItem(LS.ACCESS_TOKEN, data.access_token);
  if (data.refresh_token) {
    localStorage.setItem(LS.REFRESH_TOKEN, data.refresh_token);
  }
  // Subtract 60s as a buffer against clock skew
  const expiry = Date.now() + data.expires_in * 1000 - 60_000;
  localStorage.setItem(LS.TOKEN_EXPIRY, String(expiry));
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem(LS.REFRESH_TOKEN);
  if (!refreshToken) throw new Error("Not signed in to Google Drive");

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    signOut();
    throw new Error("Session expired — please reconnect Google Drive");
  }

  const data = await res.json();
  storeTokens(data);
  return data.access_token as string;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function signIn(): Promise<void> {
  const verifier = generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);
  sessionStorage.setItem(SS_CODE_VERIFIER, verifier);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: SCOPE,
    code_challenge: challenge,
    code_challenge_method: "S256",
    access_type: "offline",
    prompt: "consent", // required to receive refresh_token
  });

  window.location.href = `${AUTH_ENDPOINT}?${params}`;
}

/** Call once on app mount. Returns true if it handled an OAuth callback. */
export async function handleCallback(): Promise<boolean> {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  if (!code) return false;

  const verifier = sessionStorage.getItem(SS_CODE_VERIFIER);
  sessionStorage.removeItem(SS_CODE_VERIFIER);

  // Clean the code/state params from the URL
  window.history.replaceState({}, "", window.location.origin + import.meta.env.BASE_URL);

  if (!verifier) return false;

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
      code_verifier: verifier,
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    console.error("Token exchange error:", body);
    throw new Error(
      `Google Drive authorization failed: ${body?.error ?? res.status} — ${body?.error_description ?? ""}`
    );
  }

  const data = await res.json();
  storeTokens(data);
  return true;
}

export async function getValidAccessToken(): Promise<string> {
  const expiry = Number(localStorage.getItem(LS.TOKEN_EXPIRY) ?? 0);
  const accessToken = localStorage.getItem(LS.ACCESS_TOKEN);
  if (accessToken && Date.now() < expiry) return accessToken;
  return refreshAccessToken();
}

export function isSignedIn(): boolean {
  return !!localStorage.getItem(LS.REFRESH_TOKEN);
}

export function signOut(): void {
  localStorage.removeItem(LS.ACCESS_TOKEN);
  localStorage.removeItem(LS.REFRESH_TOKEN);
  localStorage.removeItem(LS.TOKEN_EXPIRY);
}
