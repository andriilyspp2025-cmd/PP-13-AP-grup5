import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { classroomsApi } from '../services/api'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
import { Plus, Edit, Trash2, DoorOpen } from 'lucide-react'

export default function Classrooms() {
  const { user } = useAuthStore()
  const [showModal, setShowModal] = useState(false)
  const [editingClassroom, setEditingClassroom] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'regular',
    capacity: '',
    building: '',
    floor: '',
  })

  const queryClient = useQueryClient()

  const { data: classrooms, isLoading } = useQuery({
    queryKey: ['classrooms'],
    queryFn: () => classroomsApi.getClassrooms(),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => classroomsApi.createClassroom({ ...data, institution_id: user?.institution_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] })
      toast.success('Classroom created successfully')
      closeModal()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to create classroom')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => classroomsApi.updateClassroom(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] })
      toast.success('Classroom updated successfully')
      closeModal()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to update classroom')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: classroomsApi.deleteClassroom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] })
      toast.success('Classroom deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to delete classroom')
    },
  })

  const closeModal = () => {
    setShowModal(false)
    setEditingClassroom(null)
    setFormData({ name: '', type: 'regular', capacity: '', building: '', floor: '' })
  }

  const openEditModal = (classroom: any) => {
    setEditingClassroom(classroom)
    setFormData({
      name: classroom.name,
      type: classroom.type,
      capacity: classroom.capacity?.toString() || '',
      building: classroom.building || '',
      floor: classroom.floor?.toString() || '',
    })
    setShowModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      name: formData.name,
      type: formData.type,
      capacity: formData.capacity ? parseInt(formData.capacity) : null,
      building: formData.building || null,
      floor: formData.floor ? parseInt(formData.floor) : null,
    }

    if (editingClassroom) {
      updateMutation.mutate({ id: editingClassroom.id, data })
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
          <h1 className="text-3xl font-bold text-gray-900">Classrooms</h1>
          <p className="mt-2 text-gray-600">Manage classrooms and facilities</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus className="h-5 w-5 mr-2" />
          Add Classroom
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading classrooms...</p>
        </div>
      ) : classrooms && classrooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classrooms.map((classroom: any) => (
            <div key={classroom.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{classroom.name}</h3>
                  <p className="text-sm text-gray-600 mt-1 capitalize">{classroom.type.replace('_', ' ')}</p>
                  {classroom.capacity && (
                    <p className="text-sm text-gray-500 mt-2">Capacity: {classroom.capacity}</p>
                  )}
                  {classroom.building && (
                    <p className="text-sm text-gray-500">
                      {classroom.building}{classroom.floor && `, Floor ${classroom.floor}`}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => openEditModal(classroom)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(classroom.id, classroom.name)}
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
          <DoorOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No classrooms found. Add your first classroom to get started.</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeModal} />
            <div className="relative bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {editingClassroom ? 'Edit Classroom' : 'Add Classroom'}
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
                    Type *
                  </label>
                  <select
                    className="input"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    required
                  >
                    <option value="regular">Regular</option>
                    <option value="lecture_hall">Lecture Hall</option>
                    <option value="computer_lab">Computer Lab</option>
                    <option value="lab">Lab</option>
                    <option value="gym">Gym</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity
                  </label>
                  <input
                    type="number"
                    className="input"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Building
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={formData.building}
                    onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Floor
                  </label>
                  <input
                    type="number"
                    className="input"
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
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
                    {editingClassroom ? 'Update' : 'Create'}
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

