import { useAuthStore } from '../store/authStore'

export default function Settings() {
  const { user } = useAuthStore()

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="space-y-6">
        {/* Profile Information */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Full Name</label>
              <p className="text-gray-900">{user?.full_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Username</label>
              <p className="text-gray-900">{user?.username}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Role</label>
              <p className="text-gray-900 capitalize">{user?.role.replace('_', ' ')}</p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" defaultChecked />
              <span>Email notifications for schedule changes</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" defaultChecked />
              <span>Push notifications</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" defaultChecked />
              <span>Daily schedule summary</span>
            </label>
          </div>
          <button className="btn btn-primary mt-4">Save Preferences</button>
        </div>

        {/* About */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">About Rozklad</h2>
          <p className="text-gray-600 mb-2">Version 1.0.0</p>
          <p className="text-gray-600">
            Rozklad is a comprehensive schedule management system for educational institutions.
          </p>
        </div>
      </div>
    </div>
  )
}

