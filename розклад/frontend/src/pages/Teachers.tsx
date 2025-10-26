import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { teachersApi } from '../services/api'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
import { Plus, Edit, Trash2, School } from 'lucide-react'

export default function Teachers() {
  const { user } = useAuthStore()
  const [showModal, setShowModal] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<any>(null)
  const [formData, setFormData] = useState({
    full_name: '',
    specialization: '',
    contact_email: '',
    contact_phone: '',
  })

  const queryClient = useQueryClient()

  const { data: teachers, isLoading } = useQuery({
    queryKey: ['teachers'],
    queryFn: () => teachersApi.getTeachers(),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => teachersApi.createTeacher({ ...data, institution_id: user?.institution_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
      toast.success('Teacher created successfully')
      closeModal()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to create teacher')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => teachersApi.updateTeacher(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
      toast.success('Teacher updated successfully')
      closeModal()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to update teacher')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: teachersApi.deleteTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
      toast.success('Teacher deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to delete teacher')
    },
  })

  const closeModal = () => {
    setShowModal(false)
    setEditingTeacher(null)
    setFormData({ full_name: '', specialization: '', contact_email: '', contact_phone: '' })
  }

  const openEditModal = (teacher: any) => {
    setEditingTeacher(teacher)
    setFormData({
      full_name: teacher.full_name,
      specialization: teacher.specialization || '',
      contact_email: teacher.contact_email || '',
      contact_phone: teacher.contact_phone || '',
    })
    setShowModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      full_name: formData.full_name,
      specialization: formData.specialization || null,
      contact_email: formData.contact_email || null,
      contact_phone: formData.contact_phone || null,
    }

    if (editingTeacher) {
      updateMutation.mutate({ id: editingTeacher.id, data })
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
          <h1 className="text-3xl font-bold text-gray-900">Teachers</h1>
          <p className="mt-2 text-gray-600">Manage teaching staff</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus className="h-5 w-5 mr-2" />
          Add Teacher
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading teachers...</p>
        </div>
      ) : teachers && teachers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teachers.map((teacher: any) => (
            <div key={teacher.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{teacher.full_name}</h3>
                  {teacher.specialization && (
                    <p className="text-sm text-gray-600 mt-1">{teacher.specialization}</p>
                  )}
                  {teacher.contact_email && (
                    <p className="text-sm text-gray-500 mt-2">{teacher.contact_email}</p>
                  )}
                  {teacher.contact_phone && (
                    <p className="text-sm text-gray-500">{teacher.contact_phone}</p>
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => openEditModal(teacher)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(teacher.id, teacher.full_name)}
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
          <School className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No teachers found. Add your first teacher to get started.</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeModal} />
            <div className="relative bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {editingTeacher ? 'Edit Teacher' : 'Add Teacher'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialization
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="input"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className="input"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
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
                    {editingTeacher ? 'Update' : 'Create'}
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

