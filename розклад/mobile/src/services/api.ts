import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const API_URL = 'http://localhost:8000' // Change this to your backend URL

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: async (username: string, password: string) => {
    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)
    const response = await api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },
}

// Schedule API
export const scheduleApi = {
  getSchedule: async (filters?: any) => {
    const response = await api.get('/schedule', { params: filters })
    return response.data
  },
}

// Change Request API
export const changeRequestApi = {
  getRequests: async (filters?: any) => {
    const response = await api.get('/change-requests', { params: filters })
    return response.data
  },
  createRequest: async (data: any) => {
    const response = await api.post('/change-requests', data)
    return response.data
  },
}

// Notifications API
export const notificationsApi = {
  getNotifications: async (unreadOnly = false) => {
    const response = await api.get('/notifications', { params: { unread_only: unreadOnly } })
    return response.data
  },
  markAsRead: async (id: number) => {
    const response = await api.put(`/notifications/${id}/read`)
    return response.data
  },
}

