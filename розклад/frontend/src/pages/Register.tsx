import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { authApi } from '../services/api'
import toast from 'react-hot-toast'
import { Calendar, Mail, CheckCircle } from 'lucide-react'

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    full_name: '',
    password: '',
    confirmPassword: '',
    role: 'student' as const,
  })
  const [loading, setLoading] = useState(false)
  const [registered, setRegistered] = useState(false)

  // Перевірка чи показувати success screen
  useEffect(() => {
    const registrationSuccess = localStorage.getItem('registration_success')
    const registrationEmail = localStorage.getItem('registration_email')
    
    if (registrationSuccess === 'true' && registrationEmail) {
      setRegistered(true)
      setFormData(prev => ({ ...prev, email: registrationEmail }))
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      await authApi.register({
        email: formData.email,
        username: formData.username,
        full_name: formData.full_name,
        password: formData.password,
        role: formData.role,
      })
      
      // Зберігаємо в localStorage щоб зберегти стан при будь-яких ре-рендерах
      localStorage.setItem('registration_success', 'true')
      localStorage.setItem('registration_email', formData.email)
      
      // Показуємо success screen
      setRegistered(true)
      toast.success('Registration successful! Check your email for verification link.')
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || 'Registration failed'
      console.error('Registration error:', error.response?.data)
      
      // Show detailed error if available
      if (typeof errorMsg === 'string') {
        toast.error(errorMsg)
      } else if (Array.isArray(errorMsg)) {
        // Pydantic validation errors
        errorMsg.forEach((err: any) => {
          toast.error(`${err.loc?.join(' → ') || 'Error'}: ${err.msg}`)
        })
      } else {
        toast.error('Registration failed. Please check your input.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (registered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Check Your Email!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Перевірте вашу пошту
            </p>
          </div>
          
          <div className="card">
            <div className="text-center space-y-4">
              <Mail className="h-12 w-12 text-primary-600 mx-auto" />
              <p className="text-gray-700">
                We've sent a verification link to:
              </p>
              <p className="font-semibold text-primary-600">
                {formData.email}
              </p>
              <p className="text-sm text-gray-600">
                Please click the link in the email to verify your account.
                The link will expire in 24 hours.
              </p>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-3">
                  Didn't receive the email?
                </p>
                <button
                  onClick={async () => {
                    try {
                      await authApi.resendVerification(formData.email)
                      toast.success('Verification email sent!')
                    } catch (error) {
                      toast.error('Failed to resend email')
                    }
                  }}
                  className="btn btn-secondary"
                >
                  Resend Email
                </button>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link 
              to="/login" 
              className="text-primary-600 hover:text-primary-700"
              onClick={() => {
                // Очищаємо localStorage при переході на логін
                localStorage.removeItem('registration_success')
                localStorage.removeItem('registration_email')
              }}
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Calendar className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Register for Rozklad
          </p>
        </div>
        
        <div className="card">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                className="input mt-1"
                placeholder="John Doe"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input mt-1"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username *
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="input mt-1"
                placeholder="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role *
              </label>
              <select
                id="role"
                name="role"
                required
                className="input mt-1"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="parent">Parent</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input mt-1"
                placeholder="Enter password (min 6 characters)"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="input mt-1"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center text-sm">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

