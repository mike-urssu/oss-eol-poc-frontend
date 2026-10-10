import { mockApi } from './mock';
import type { Api } from './types';

const BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

/** HTTP error carrying the RFC 9457 Problem Details `detail` (or `title`) as its message. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(BASE + path, {
    ...init,
    headers: { Accept: 'application/json', ...(init?.body ? { 'Content-Type': 'application/json' } : {}) },
  });
  if (!res.ok) {
    const problem = await res.json().catch(() => null);
    throw new ApiError(res.status, problem?.detail ?? problem?.title ?? `HTTP ${res.status}`);
  }
  return res.json();
}

const httpApi: Api = {
  listOpensources: (filter) => {
    const params = new URLSearchParams(Object.entries(filter).filter(([, v]) => v) as [string, string][]);
    return request(`/api/opensources?${params}`);
  },
  getOpensource: (slug) => request(`/api/opensources/${encodeURIComponent(slug)}`),
  recollect: (slug, sourceId) =>
    request(`/api/opensources/${encodeURIComponent(slug)}/collections`, { method: 'POST', body: JSON.stringify(sourceId ? { sourceId } : {}) }),
};

// `npm run dev:mock` serves fixture data until the backend implements these endpoints.
export const api: Api = import.meta.env.VITE_API_MOCK === 'true' ? mockApi : httpApi;
