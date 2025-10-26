import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'

interface User {
  id: number
  email: string
  username: string
  full_name: string
  role: 'super_admin' | 'admin' | 'teacher' | 'student' | 'parent'
  institution_id?: number
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => Promise<void>
  logout: () => Promise<void>
  loadAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  
  setAuth: async (user, token) => {
    await SecureStore.setItemAsync('user', JSON.stringify(user))
    await SecureStore.setItemAsync('token', token)
    set({ user, token, isAuthenticated: true })
  },
  
  logout: async () => {
    await SecureStore.deleteItemAsync('user')
    await SecureStore.deleteItemAsync('token')
    set({ user: null, token: null, isAuthenticated: false })
  },
  
  loadAuth: async () => {
    const userStr = await SecureStore.getItemAsync('user')
    const token = await SecureStore.getItemAsync('token')
    
    if (userStr && token) {
      const user = JSON.parse(userStr)
      set({ user, token, isAuthenticated: true })
    }
  },
}))

