/** Thrown by apiPost. data is whatever the server sent back with the error, if anything. */
export class ApiRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly data: Record<string, unknown> | null
  ) {
    super(message)
  }
}

/** POSTs to one of our API routes. Throws an ApiRequestError with the server's message if the request fails. */
export async function apiPost<T = unknown>(path: string, fallbackError: string, body?: unknown): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    ...(body !== undefined && {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new ApiRequestError(data?.message || fallbackError, res.status, data)
  return data as T
}

/** The message to show for something caught in a catch block. */
export function errorMessage(err: unknown, fallback = 'Something went wrong'): string {
  return (err instanceof Error && err.message) || fallback
}
