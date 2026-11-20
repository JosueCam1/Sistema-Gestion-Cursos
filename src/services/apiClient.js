const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";

/** Central fetch wrapper for the future FastAPI integration. No demo screen calls this yet. */
export async function apiRequest(path, options = {}) {
  const response = await fetch(
    baseUrl.replace(/\/$/, "") + "/" + path.replace(/^\//, ""),
    {
      ...options,
      headers: { Accept: "application/json", ...options.headers },
      credentials: "include",
    },
  );
  if (!response.ok) {
    const error = new Error("La solicitud no se pudo completar.");
    error.status = response.status;
    throw error;
  }
  if (response.status === 204) return null;
  return response.json();
}

export const apiBaseUrl = baseUrl;
