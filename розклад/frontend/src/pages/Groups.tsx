import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { groupsApi } from '../services/api'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
import { Plus, Edit, Trash2, Users } from 'lucide-react'

export default function Groups() {
  const { user } = useAuthStore()
  const [showModal, setShowModal] = useState(false)
  const [editingGroup, setEditingGroup] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    profile: '',
    student_count: '',
    year: '',
  })

  const queryClient = useQueryClient()

  const { data: groups, isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: () => groupsApi.getGroups(),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => groupsApi.createGroup({ ...data, institution_id: user?.institution_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      toast.success('Group created successfully')
      closeModal()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to create group')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => groupsApi.updateGroup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      toast.success('Group updated successfully')
      closeModal()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to update group')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: groupsApi.deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      toast.success('Group deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to delete group')
    },
  })

  const closeModal = () => {
    setShowModal(false)
    setEditingGroup(null)
    setFormData({ name: '', profile: '', student_count: '', year: '' })
  }

  const openEditModal = (group: any) => {
    setEditingGroup(group)
    setFormData({
      name: group.name,
      profile: group.profile || '',
      student_count: group.student_count?.toString() || '',
      year: group.year?.toString() || '',
    })
    setShowModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      name: formData.name,
      profile: formData.profile || null,
      student_count: formData.student_count ? parseInt(formData.student_count) : null,
      year: formData.year ? parseInt(formData.year) : null,
    }

    if (editingGroup) {
      updateMutation.mutate({ id: editingGroup.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Groups/Classes</h1>
          <p className="mt-2 text-gray-600">Manage student groups and classes</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus className="h-5 w-5 mr-2" />
          Add Group
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading groups...</p>
        </div>
      ) : groups && groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group: any) => (
            <div key={group.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                  {group.profile && (
                    <p className="text-sm text-gray-600 mt-1">{group.profile}</p>
                  )}
                  <div className="mt-3 flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    {group.student_count || 0} students
                  </div>
                  {group.year && (
                    <p className="text-sm text-gray-500 mt-1">Year: {group.year}</p>
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => openEditModal(group)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(group.id, group.name)}
                    className="p-2 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No groups found. Create your first group to get started.</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeModal} />
            <div className="relative bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {editingGroup ? 'Edit Group' : 'Add Group'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile/Specialization
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={formData.profile}
                    onChange={(e) => setFormData({ ...formData, profile: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Count
                  </label>
                  <input
                    type="number"
                    className="input"
                    value={formData.student_count}
                    onChange={(e) => setFormData({ ...formData, student_count: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    className="input"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  />
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button type="button" onClick={closeModal} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="btn btn-primary"
                  >
                    {editingGroup ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

