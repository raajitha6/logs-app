export const API_URL = "http://127.0.0.1:8000"

export const getToken = () => localStorage.getItem("token")
export const setToken = (t) => localStorage.setItem("token", t)
export const clearToken = () => localStorage.removeItem("token")

export function authFetch(path, options = {}) {
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      Authorization: `Bearer ${getToken()}`,
    },
  })
}