import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { authApi } from '../services/api'
import { CheckCircle, XCircle, Loader } from 'lucide-react'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('No verification token provided')
      return
    }

    verifyEmail()
  }, [token])

  const verifyEmail = async () => {
    try {
      const response = await authApi.verifyEmail(token!)
      setStatus('success')
      setMessage(response.message)
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (error: any) {
      setStatus('error')
      setMessage(error.response?.data?.detail || 'Email verification failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="card text-center">
          {status === 'loading' && (
            <>
              <Loader className="h-16 w-16 text-primary-600 mx-auto animate-spin" />
              <h2 className="mt-6 text-2xl font-bold text-gray-900">
                Verifying Email...
              </h2>
              <p className="mt-2 text-gray-600">
                Please wait while we verify your email address.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="mt-6 text-2xl font-bold text-gray-900">
                Email Verified!
              </h2>
              <p className="mt-2 text-gray-600">
                {message}
              </p>
              <p className="mt-4 text-sm text-gray-500">
                Redirecting to login page...
              </p>
              <div className="mt-6">
                <Link to="/login" className="btn btn-primary">
                  Go to Login
                </Link>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="h-16 w-16 text-red-500 mx-auto" />
              <h2 className="mt-6 text-2xl font-bold text-gray-900">
                Verification Failed
              </h2>
              <p className="mt-2 text-gray-600">
                {message}
              </p>
              <div className="mt-6 space-y-3">
                <Link to="/login" className="btn btn-primary block">
                  Back to Login
                </Link>
                <Link to="/register" className="btn btn-secondary block">
                  Register Again
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

