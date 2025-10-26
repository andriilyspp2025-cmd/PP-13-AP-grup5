import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { scheduleApi } from '../services/api'

export default function ScheduleScreen() {
  const { data: schedule, isLoading } = useQuery({
    queryKey: ['schedule'],
    queryFn: () => scheduleApi.getSchedule(),
  })

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']

  const getScheduleForDay = (day: string) => {
    return schedule?.filter((entry: any) => entry.day_of_week === day) || []
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Schedule</Text>
      </View>

      {isLoading ? (
        <Text style={styles.loading}>Loading schedule...</Text>
      ) : (
        days.map((day) => {
          const daySchedule = getScheduleForDay(day)
          return (
            <View key={day} style={styles.daySection}>
              <Text style={styles.dayTitle}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
              {daySchedule.length > 0 ? (
                daySchedule.map((entry: any) => (
                  <View key={entry.id} style={styles.scheduleCard}>
                    <Text style={styles.subjectName}>{entry.subject_name}</Text>
                    <Text style={styles.scheduleTime}>
                      {entry.start_time} - {entry.end_time}
                    </Text>
                    <Text style={styles.scheduleDetails}>
                      {entry.teacher_name} • {entry.classroom_name}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No classes</Text>
              )}
            </View>
          )
        })
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  loading: {
    textAlign: 'center',
    padding: 20,
    color: '#6b7280',
  },
  daySection: {
    padding: 20,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  scheduleCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
  },
  scheduleTime: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  scheduleDetails: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    padding: 12,
  },
})

