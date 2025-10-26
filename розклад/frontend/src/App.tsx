import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Schedule from './pages/Schedule'
import ScheduleBuilder from './pages/ScheduleBuilder'
import ChangeRequests from './pages/ChangeRequests'
import Groups from './pages/Groups'
import Teachers from './pages/Teachers'
import Classrooms from './pages/Classrooms'
import Settings from './pages/Settings'

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
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

