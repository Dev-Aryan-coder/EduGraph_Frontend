import axios from 'axios'

// Base URL points to the Spring Boot backend server on port 8080
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
})

// Request Interceptor: Attach JWT Token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('edugraph_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Standardize API error extraction
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let customMessage = 'Unable to connect to the server. Please check your network or ensure the backend is running.'

    if (error.response) {
      const data = error.response.data
      if (typeof data === 'string') {
        customMessage = data
      } else if (data && data.message) {
        customMessage = data.message
      } else if (data && data.data && data.data.details) {
        customMessage = data.data.details
      } else if (error.response.status === 401) {
        customMessage = 'Session expired or invalid credentials. Please log in again.'
      } else if (error.response.status === 403) {
        customMessage = 'You do not have permission to access this resource.'
      } else if (error.response.status === 404) {
        customMessage = 'The requested resource was not found on the server.'
      } else if (error.response.status >= 500) {
        customMessage = 'Internal server error occurred. Please try again later.'
      }
    } else if (error.request) {
      customMessage = 'Cannot connect to backend server at http://localhost:8080. Please ensure Spring Boot is running.'
    }

    const enhancedError = new Error(customMessage)
    enhancedError.status = error.response ? error.response.status : null
    enhancedError.originalError = error
    return Promise.reject(enhancedError)
  }
)

export default api
