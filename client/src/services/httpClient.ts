export class ApiError extends Error {
  constructor(message: string, readonly status: number) { super(message); }
}

type Params = Record<string, string | number | undefined>;
const BASE = import.meta.env.VITE_API_BASE ?? '/api';

/** GET + runtime validation. The guard protects the UI from malformed server responses. */
export async function getJson<T>(path: string, params: Params, guard: (v: unknown) => v is T, signal?: AbortSignal): Promise<T> {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== '') qs.set(k, String(v));
  const query = qs.toString();

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}${query ? `?${query}` : ''}`, { signal, headers: { Accept: 'application/json' } });
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') throw e;
    throw new ApiError('Cannot reach the server. Check that the API is running and try again.', 0);
  }
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body: unknown = await res.json();
      const err = (body as { error?: { message?: string; details?: string[] } }).error;
      if (err?.message) message = err.details?.length ? `${err.message}: ${err.details.join('; ')}` : err.message;
    } catch { /* non-JSON error body */ }
    throw new ApiError(message, res.status);
  }
  const body: unknown = await res.json();
  if (!guard(body)) throw new ApiError('The server returned an unexpected response.', 502);
  return body;
}
