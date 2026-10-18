export const API_URL = "http://localhost:8000"

export async function authFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
  })
  if (res.status === 401) window.dispatchEvent(new Event("auth:logout"))
  return res
}