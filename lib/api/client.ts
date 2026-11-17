// Cliente HTTP base para el backend de Cruz Control Tours.
//
// Usa NEXT_PUBLIC_API_URL (p. ej. http://localhost:3002/api/v1) y cae al
// puerto local del backend cuando la variable no existe. El backend envuelve
// las respuestas JSON en `{ data }` y los errores en `{ message }`.

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3002/api/v1";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** Convierte cualquier error de fetch/thunk en un mensaje legible. */
export function toErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  if (typeof error === "string" && error.trim()) return error;
  return "Ocurrió un error inesperado. Inténtalo de nuevo.";
}

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

/**
 * Fetch tipado contra `${API_BASE_URL}${path}`.
 * Desenvuelve `{ data }` y lanza ApiError con el `message` del backend.
 */
export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { body, headers, ...init } = options;

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(
      "No se pudo conectar con el servidor. Revisa tu conexión.",
      0,
    );
  }

  // 204 (DELETE): sin cuerpo.
  if (res.status === 204) return undefined as T;

  const payload: { data?: T; message?: string } | null = await res
    .json()
    .catch(() => null);

  if (!res.ok) {
    throw new ApiError(
      payload?.message ?? `Error del servidor (${res.status})`,
      res.status,
    );
  }

  return (payload !== null && "data" in payload ? payload.data : payload) as T;
}
