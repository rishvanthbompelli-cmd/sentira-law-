export const API_BASE_URL = import.meta.env.VITE_API_URL || ''

export const apiUrl = (path) => {
  // If VITE_API_URL is set, it can be http://localhost:3001 or a deployed URL
  // Otherwise this falls back to relative URL on same origin, using Vite proxy in development
  return `${API_BASE_URL}${path}`
}
