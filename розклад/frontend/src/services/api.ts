import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

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
  (error) => {
    if (error.response?.status === 401) {
      // Не викликаємо logout на публічних сторінках
      const publicPaths = ['/login', '/register', '/verify-email']
      const isPublicPage = publicPaths.some(path => window.location.pathname.includes(path))
      
      if (!isPublicPage) {
        useAuthStore.getState().logout()
        window.location.href = '/login'
      }
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
  register: async (data: any) => {
    const response = await api.post('/auth/register', data)
    return response.data
  },
  verifyEmail: async (token: string) => {
    const response = await api.post('/auth/verify-email', { token })
    return response.data
  },
  resendVerification: async (email: string) => {
    const response = await api.post('/auth/resend-verification', null, {
      params: { email }
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
  createEntry: async (data: any) => {
    const response = await api.post('/schedule', data)
    return response.data
  },
  updateEntry: async (id: number, data: any) => {
    const response = await api.put(`/schedule/${id}`, data)
    return response.data
  },
  deleteEntry: async (id: number) => {
    const response = await api.delete(`/schedule/${id}`)
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
  updateRequest: async (id: number, data: any) => {
    const response = await api.put(`/change-requests/${id}`, data)
    return response.data
  },
}

// Groups API
export const groupsApi = {
  getGroups: async (institutionId?: number) => {
    const response = await api.get('/groups', { params: { institution_id: institutionId } })
    return response.data
  },
  createGroup: async (data: any) => {
    const response = await api.post('/groups', data)
    return response.data
  },
  updateGroup: async (id: number, data: any) => {
    const response = await api.put(`/groups/${id}`, data)
    return response.data
  },
  deleteGroup: async (id: number) => {
    const response = await api.delete(`/groups/${id}`)
    return response.data
  },
}

// Teachers API
export const teachersApi = {
  getTeachers: async (institutionId?: number) => {
    const response = await api.get('/teachers', { params: { institution_id: institutionId } })
    return response.data
  },
  createTeacher: async (data: any) => {
    const response = await api.post('/teachers', data)
    return response.data
  },
  updateTeacher: async (id: number, data: any) => {
    const response = await api.put(`/teachers/${id}`, data)
    return response.data
  },
  deleteTeacher: async (id: number) => {
    const response = await api.delete(`/teachers/${id}`)
    return response.data
  },
}

// Classrooms API
export const classroomsApi = {
  getClassrooms: async (institutionId?: number) => {
    const response = await api.get('/classrooms', { params: { institution_id: institutionId } })
    return response.data
  },
  createClassroom: async (data: any) => {
    const response = await api.post('/classrooms', data)
    return response.data
  },
  updateClassroom: async (id: number, data: any) => {
    const response = await api.put(`/classrooms/${id}`, data)
    return response.data
  },
  deleteClassroom: async (id: number) => {
    const response = await api.delete(`/classrooms/${id}`)
    return response.data
  },
}

// Subjects API
export const subjectsApi = {
  getSubjects: async (institutionId?: number) => {
    const response = await api.get('/subjects', { params: { institution_id: institutionId } })
    return response.data
  },
  createSubject: async (data: any) => {
    const response = await api.post('/subjects', data)
    return response.data
  },
}

// Time Slots API
export const timeSlotsApi = {
  getTimeSlots: async (institutionId?: number) => {
    const response = await api.get('/time-slots', { params: { institution_id: institutionId } })
    return response.data
  },
  createTimeSlot: async (data: any) => {
    const response = await api.post('/time-slots', data)
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
  markAllAsRead: async () => {
    const response = await api.put('/notifications/mark-all-read')
    return response.data
  },
}

