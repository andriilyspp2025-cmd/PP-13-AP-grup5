import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { scheduleApi, groupsApi, teachersApi, classroomsApi, subjectsApi, timeSlotsApi } from '../services/api'
import toast from 'react-hot-toast'
import { Plus, Save } from 'lucide-react'

export default function ScheduleBuilder() {
  const [showModal, setShowModal] = useState(false)
  const [newEntry, setNewEntry] = useState({
    day_of_week: 'monday',
    group_id: '',
    subject_id: '',
    teacher_id: '',
    classroom_id: '',
    time_slot_id: '',
  })

  const queryClient = useQueryClient()

  const { data: groups } = useQuery({
    queryKey: ['groups'],
    queryFn: () => groupsApi.getGroups(),
  })

  const { data: teachers } = useQuery({
    queryKey: ['teachers'],
    queryFn: () => teachersApi.getTeachers(),
  })

  const { data: classrooms } = useQuery({
    queryKey: ['classrooms'],
    queryFn: () => classroomsApi.getClassrooms(),
  })

  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => subjectsApi.getSubjects(),
  })

  const { data: timeSlots } = useQuery({
    queryKey: ['timeSlots'],
    queryFn: () => timeSlotsApi.getTimeSlots(),
  })

  const createMutation = useMutation({
    mutationFn: scheduleApi.createEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule'] })
      toast.success('Schedule entry created successfully')
      setShowModal(false)
      resetForm()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to create entry')
    },
  })

  const resetForm = () => {
    setNewEntry({
      day_of_week: 'monday',
      group_id: '',
      subject_id: '',
      teacher_id: '',
      classroom_id: '',
      time_slot_id: '',
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate({
      ...newEntry,
      group_id: parseInt(newEntry.group_id),
      subject_id: parseInt(newEntry.subject_id),
      teacher_id: parseInt(newEntry.teacher_id),
      classroom_id: parseInt(newEntry.classroom_id),
      time_slot_id: parseInt(newEntry.time_slot_id),
    })
  }

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Schedule Builder</h1>
          <p className="mt-2 text-gray-600">Create and manage the master schedule</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus className="h-5 w-5 mr-2" />
          Add Schedule Entry
        </button>
      </div>

      <div className="card">
        <p className="text-gray-600 mb-4">
          Use the Schedule Builder to create class entries. The system will automatically check for conflicts
          such as teacher or classroom double-booking.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Features:</h3>
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
            <li>Automatic conflict detection</li>
            <li>Drag-and-drop scheduling (coming soon)</li>
            <li>AI-powered schedule optimization (coming soon)</li>
            <li>CSV/Excel import (coming soon)</li>
          </ul>
        </div>
      </div>

      {/* Modal for creating new entry */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowModal(false)} />
            
            <div className="relative bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add Schedule Entry</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Day of Week
                  </label>
                  <select
                    className="input"
                    value={newEntry.day_of_week}
                    onChange={(e) => setNewEntry({ ...newEntry, day_of_week: e.target.value })}
                    required
                  >
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Group
                  </label>
                  <select
                    className="input"
                    value={newEntry.group_id}
                    onChange={(e) => setNewEntry({ ...newEntry, group_id: e.target.value })}
                    required
                  >
                    <option value="">Select a group</option>
                    {groups?.map((group: any) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <select
                    className="input"
                    value={newEntry.subject_id}
                    onChange={(e) => setNewEntry({ ...newEntry, subject_id: e.target.value })}
                    required
                  >
                    <option value="">Select a subject</option>
                    {subjects?.map((subject: any) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teacher
                  </label>
                  <select
                    className="input"
                    value={newEntry.teacher_id}
                    onChange={(e) => setNewEntry({ ...newEntry, teacher_id: e.target.value })}
                    required
                  >
                    <option value="">Select a teacher</option>
                    {teachers?.map((teacher: any) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.full_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Classroom
                  </label>
                  <select
                    className="input"
                    value={newEntry.classroom_id}
                    onChange={(e) => setNewEntry({ ...newEntry, classroom_id: e.target.value })}
                    required
                  >
                    <option value="">Select a classroom</option>
                    {classrooms?.map((classroom: any) => (
                      <option key={classroom.id} value={classroom.id}>
                        {classroom.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time Slot
                  </label>
                  <select
                    className="input"
                    value={newEntry.time_slot_id}
                    onChange={(e) => setNewEntry({ ...newEntry, time_slot_id: e.target.value })}
                    required
                  >
                    <option value="">Select a time slot</option>
                    {timeSlots?.map((slot: any) => (
                      <option key={slot.id} value={slot.id}>
                        {slot.name} ({slot.start_time} - {slot.end_time})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="btn btn-primary"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {createMutation.isPending ? 'Creating...' : 'Create Entry'}
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

