/** POSTs to one of our API routes. Throws an Error with the server's message if the request fails. */
export async function apiPost<T = unknown>(path: string, fallbackError: string, body?: unknown): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    ...(body !== undefined && {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.message || fallbackError)
  return data as T
}

/** The message to show for something caught in a catch block. */
export function errorMessage(err: unknown, fallback = 'Something went wrong'): string {
  return (err instanceof Error && err.message) || fallback
}
