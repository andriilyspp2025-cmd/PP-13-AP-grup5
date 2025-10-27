import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyEmail from './pages/VerifyEmail'
import Dashboard from './pages/Dashboard'
import Schedule from './pages/Schedule'
import ScheduleBuilder from './pages/ScheduleBuilder'
import ChangeRequests from './pages/ChangeRequests'
import Groups from './pages/Groups'
import Teachers from './pages/Teachers'
import Classrooms from './pages/Classrooms'
import Settings from './pages/Settings'

function App() {
  const { isAuthenticated, _hasHydrated } = useAuthStore()

  // Чекаємо поки zustand завантажить стан з localStorage
  if (!_hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  console.log('🔍 App render - isAuthenticated:', isAuthenticated, 'hydrated:', _hasHydrated)

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/schedule" element={<Schedule />} />
                  <Route path="/schedule/builder" element={<ScheduleBuilder />} />
                  <Route path="/change-requests" element={<ChangeRequests />} />
                  <Route path="/groups" element={<Groups />} />
                  <Route path="/teachers" element={<Teachers />} />
                  <Route path="/classrooms" element={<Classrooms />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  )
}

export default App

