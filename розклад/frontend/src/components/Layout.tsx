import { ReactNode, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Calendar, 
  Users, 
  School, 
  DoorOpen, 
  Settings, 
  Bell, 
  Menu, 
  X,
  LogOut,
  FileEdit
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useQuery } from '@tanstack/react-query'
import { notificationsApi } from '../services/api'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const { data: notifications } = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: () => notificationsApi.getNotifications(true),
  })

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Calendar },
    { name: 'Schedule', href: '/schedule', icon: Calendar },
    ...(user?.role !== 'student' && user?.role !== 'parent' 
      ? [{ name: 'Schedule Builder', href: '/schedule/builder', icon: FileEdit }]
      : []
    ),
    ...(user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'teacher'
      ? [{ name: 'Change Requests', href: '/change-requests', icon: FileEdit }]
      : []
    ),
    ...(user?.role === 'super_admin' || user?.role === 'admin'
      ? [
          { name: 'Groups', href: '/groups', icon: Users },
          { name: 'Teachers', href: '/teachers', icon: School },
          { name: 'Classrooms', href: '/classrooms', icon: DoorOpen },
        ]
      : []
    ),
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
            <div className="flex h-16 items-center justify-between px-4 border-b">
              <h1 className="text-2xl font-bold text-primary-600">Rozklad</h1>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r">
          <div className="flex h-16 items-center px-6 border-b">
            <h1 className="text-2xl font-bold text-primary-600">Rozklad</h1>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="border-t p-4">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role.replace('_', ' ')}</p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex h-16 bg-white border-b">
          <button
            className="px-4 text-gray-500 focus:outline-none lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex flex-1 justify-end px-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-600">
              <Bell className="h-6 w-6" />
              {notifications && notifications.length > 0 && (
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500" />
              )}
            </button>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}

