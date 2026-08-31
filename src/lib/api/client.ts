import { mockRequest } from "./mock-db";

/**
 * Cliente HTTP para la API REST de PETCARE (Java + Spring Boot / MySQL).
 *
 * Base URL configurable con VITE_API_URL, por ejemplo:
 *   VITE_API_URL=http://localhost:8080/api
 *
 * Si el backend todavía no está disponible, se usa un respaldo local en memoria
 * para poder navegar la aplicación sin romper la experiencia.
 */
const API_URL_CONFIGURADA = (import.meta.env["VITE_API_URL"] as string | undefined)?.trim();

/** Sólo se hacen llamadas HTTP reales si VITE_API_URL está configurada. */
export const API_BASE_URL = API_URL_CONFIGURADA ?? "/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

let backendDisponible: boolean | null = null;

export const usingFallback = () => backendDisponible === false;

async function httpRequest<T>(method: HttpMethod, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: { Accept: "application/json", ...(body ? { "Content-Type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : null,
  });

  if (!res.ok) {
    throw new ApiError(`Error ${res.status} al llamar ${method} ${path}`, res.status);
  }
  if (res.status === 204) return undefined as T;

  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export async function apiRequest<T>(method: HttpMethod, path: string, body?: unknown): Promise<T> {
  if (typeof window === "undefined") {
    // Durante el render en servidor no se llama a la API: los datos se cargan en el cliente.
    return mockRequest<T>(method, path, body);
  }

  if (backendDisponible === false) {
    return mockRequest<T>(method, path, body);
  }

  try {
    const data = await httpRequest<T>(method, path, body);
    backendDisponible = true;
    return data;
  } catch (error) {
    if (backendDisponible === true && error instanceof ApiError) {
      // Backend activo: se propaga el error real de negocio.
      throw error;
    }
    backendDisponible = false;
    return mockRequest<T>(method, path, body);
  }
}

export const api = {
  get: <T>(path: string) => apiRequest<T>("GET", path),
  post: <T>(path: string, body: unknown) => apiRequest<T>("POST", path, body),
  put: <T>(path: string, body: unknown) => apiRequest<T>("PUT", path, body),
  delete: <T = void>(path: string) => apiRequest<T>("DELETE", path),
};
