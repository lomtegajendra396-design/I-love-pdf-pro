// Utility for dynamic API base URL resolution
// If running on GitHub Pages or custom domain with a separated backend,
// it uses VITE_API_BASE_URL (or localStorage override).
// If running in same-origin (Cloud Run, Render, localhost), it uses relative '' path.

const STORAGE_KEY = 'pdf_tools_custom_backend_url';

export function getApiBaseUrl(): string {
  // 1. User manual override (set in UI if using static GitHub Pages with external backend)
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved.trim()) {
      return saved.trim().replace(/\/+$/, '');
    }
  }

  // 2. Vite build-time environment variable (e.g. VITE_API_BASE_URL=https://my-backend.onrender.com)
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, '');
  }

  // 3. Default relative path for full-stack deployments (Google Cloud Run, Render, dev server)
  return '';
}

export function setCustomBackendUrl(url: string | null) {
  if (typeof window === 'undefined') return;
  if (!url || !url.trim()) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, url.trim().replace(/\/+$/, ''));
  }
}

export function getSavedBackendUrl(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(STORAGE_KEY) || (import.meta.env.VITE_API_BASE_URL as string) || '';
}

export function buildApiUrl(path: string): string {
  const base = getApiBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}
