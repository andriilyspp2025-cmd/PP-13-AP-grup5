import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

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
  _hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
  setAuth: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      setAuth: (user, token) => {
        console.log('🔐 Setting auth:', { user, hasToken: !!token })
        set({ user, token, isAuthenticated: true })
      },
      logout: () => {
        console.log('🚪 Logging out')
        set({ user: null, token: null, isAuthenticated: false })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        console.log('💧 Hydration complete:', { 
          hasUser: !!state?.user, 
          hasToken: !!state?.token,
          isAuthenticated: state?.isAuthenticated 
        })
        state?.setHasHydrated(true)
      },
    }
  )
)

