import { useQuery } from '@tanstack/react-query'
import { Calendar, Users, FileEdit, Bell } from 'lucide-react'
import { scheduleApi, changeRequestApi, notificationsApi } from '../services/api'
import { useAuthStore } from '../store/authStore'
import { format } from 'date-fns'

export default function Dashboard() {
  const { user } = useAuthStore()

  const { data: todaySchedule } = useQuery({
    queryKey: ['schedule', 'today'],
    queryFn: () => scheduleApi.getSchedule({ specific_date: format(new Date(), 'yyyy-MM-dd') }),
  })

  const { data: changeRequests } = useQuery({
    queryKey: ['change-requests', 'pending'],
    queryFn: () => changeRequestApi.getRequests({ status: 'pending' }),
    enabled: user?.role === 'super_admin' || user?.role === 'admin',
  })

  const { data: notifications } = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: () => notificationsApi.getNotifications(true),
  })

  const stats = [
    {
      name: "Today's Classes",
      value: todaySchedule?.length || 0,
      icon: Calendar,
      color: 'bg-blue-500',
    },
    {
      name: 'Pending Requests',
      value: changeRequests?.length || 0,
      icon: FileEdit,
      color: 'bg-yellow-500',
      hidden: user?.role === 'student' || user?.role === 'parent',
    },
    {
      name: 'Unread Notifications',
      value: notifications?.length || 0,
      icon: Bell,
      color: 'bg-red-500',
    },
  ].filter((stat) => !stat.hidden)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.full_name}!
        </h1>
        <p className="mt-2 text-gray-600">
          {format(new Date(), 'EEEE, MMMM do, yyyy')}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="card">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Today's Schedule */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Today's Schedule</h2>
        {todaySchedule && todaySchedule.length > 0 ? (
          <div className="space-y-3">
            {todaySchedule.map((entry: any) => (
              <div
                key={entry.id}
                className={`p-4 rounded-lg border-l-4 ${
                  entry.status === 'cancelled'
                    ? 'border-red-500 bg-red-50'
                    : entry.status === 'rescheduled'
                    ? 'border-yellow-500 bg-yellow-50'
                    : entry.status === 'substituted'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-green-500 bg-green-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{entry.subject_name}</h3>
                    <p className="text-sm text-gray-600">
                      {entry.start_time} - {entry.end_time}
                    </p>
                    <p className="text-sm text-gray-600">
                      {entry.teacher_name} • {entry.classroom_name}
                    </p>
                    {entry.substitute_teacher_name && (
                      <p className="text-sm text-blue-600 mt-1">
                        Substitute: {entry.substitute_teacher_name}
                      </p>
                    )}
                  </div>
                  {entry.status !== 'scheduled' && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full capitalize bg-white">
                      {entry.status}
                    </span>
                  )}
                </div>
                {entry.notes && (
                  <p className="mt-2 text-sm text-gray-600 italic">{entry.notes}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No classes scheduled for today.</p>
        )}
      </div>

      {/* Recent Notifications */}
      {notifications && notifications.length > 0 && (
        <div className="card mt-6">
          <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>
          <div className="space-y-3">
            {notifications.slice(0, 5).map((notification: any) => (
              <div key={notification.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                <Bell className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{notification.title}</p>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

