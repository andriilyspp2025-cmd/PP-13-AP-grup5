import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { scheduleApi } from '../services/api'
import { format, startOfWeek, addDays } from 'date-fns'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

export default function Schedule() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }) // Monday

  const { data: schedule, isLoading } = useQuery({
    queryKey: ['schedule', format(weekStart, 'yyyy-MM-dd')],
    queryFn: () => scheduleApi.getSchedule(),
  })

  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i))

  const getScheduleForDay = (day: Date) => {
    const dayName = format(day, 'EEEE').toLowerCase()
    return schedule?.filter((entry: any) => entry.day_of_week === dayName) || []
  }

  const goToPreviousWeek = () => {
    setCurrentDate(addDays(currentDate, -7))
  }

  const goToNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
        
        <div className="flex items-center space-x-4">
          <button onClick={goToToday} className="btn btn-secondary">
            <Calendar className="h-4 w-4 mr-2" />
            Today
          </button>
          <div className="flex items-center space-x-2">
            <button onClick={goToPreviousWeek} className="btn btn-secondary p-2">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-lg font-medium">
              {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 4), 'MMM d, yyyy')}
            </span>
            <button onClick={goToNextWeek} className="btn btn-secondary p-2">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading schedule...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {weekDays.map((day) => {
            const daySchedule = getScheduleForDay(day)
            const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
            
            return (
              <div key={day.toString()} className={`card ${isToday ? 'ring-2 ring-primary-500' : ''}`}>
                <div className="mb-4">
                  <h3 className={`font-semibold ${isToday ? 'text-primary-600' : 'text-gray-900'}`}>
                    {format(day, 'EEEE')}
                  </h3>
                  <p className="text-sm text-gray-500">{format(day, 'MMM d')}</p>
                </div>

                <div className="space-y-2">
                  {daySchedule.length > 0 ? (
                    daySchedule.map((entry: any) => (
                      <div
                        key={entry.id}
                        className={`p-3 rounded-lg text-sm border-l-4 ${
                          entry.status === 'cancelled'
                            ? 'border-red-500 bg-red-50'
                            : entry.status === 'rescheduled'
                            ? 'border-yellow-500 bg-yellow-50'
                            : entry.status === 'substituted'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-green-500 bg-green-50'
                        }`}
                      >
                        <p className="font-medium text-gray-900">{entry.subject_name}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {entry.start_time} - {entry.end_time}
                        </p>
                        <p className="text-xs text-gray-600">{entry.classroom_name}</p>
                        <p className="text-xs text-gray-600">{entry.teacher_name}</p>
                        {entry.status !== 'scheduled' && (
                          <p className="text-xs font-medium mt-1 capitalize text-gray-700">
                            {entry.status}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-4">No classes</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

