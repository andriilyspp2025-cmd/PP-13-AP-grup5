import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { authApi } from '../services/api'
import toast from 'react-hot-toast'
import { Calendar } from 'lucide-react'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { access_token } = await authApi.login(username, password)
      
      console.log('✅ Login API successful, token received')
      
      // Decode JWT to get user info (simplified - in production use a proper JWT decoder)
      const payload = JSON.parse(atob(access_token.split('.')[1]))
      
      // Mock user data - in production, fetch from /users/me endpoint
      const mockUser = {
        id: payload.sub,
        email: `${username}@example.com`,
        username,
        full_name: username,
        role: 'admin' as const,
        institution_id: 1,
      }
      
      console.log('👤 Setting user:', mockUser.username)
      
      // Зберігаємо auth state - zustand persist автоматично збереже в localStorage
      setAuth(mockUser, access_token)
      
      toast.success('Login successful!')
      
      console.log('🚀 Navigating to dashboard...')
      
      // Використовуємо navigate - App тепер чекає hydration
      navigate('/')
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Login failed'
      
      // Спеціальне повідомлення для неверифікованого email
      if (error.response?.status === 403) {
        toast.error(errorMessage, { duration: 5000 })
      } else {
        toast.error(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Calendar className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Rozklad
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Smart Schedule Management System
          </p>
        </div>
        
        <div className="card">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="input mt-1"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input mt-1"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center text-sm">
          <span className="text-gray-600">Don't have an account? </span>
          <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign up
          </Link>
        </div>

        <div className="text-center text-sm text-gray-600 border-t pt-4">
          <p className="font-medium mb-2">Demo credentials:</p>
          <p>Username: <span className="font-semibold">admin</span></p>
          <p>Password: <span className="font-semibold">admin123</span></p>
        </div>
      </div>
    </div>
  )
}

