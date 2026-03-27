export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3001'

export const apiUrl = (path) => {
  return `${API_BASE_URL}${path}`
}
