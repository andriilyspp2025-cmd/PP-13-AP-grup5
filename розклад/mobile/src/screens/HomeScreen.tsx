import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { scheduleApi, notificationsApi } from '../services/api'
import { useAuthStore } from '../store/authStore'
import { format } from 'date-fns'
import { Calendar, Bell, FileText } from 'lucide-react-native'

export default function HomeScreen() {
  const { user } = useAuthStore()

  const { data: todaySchedule, refetch, isRefetching } = useQuery({
    queryKey: ['schedule', 'today'],
    queryFn: () => scheduleApi.getSchedule({ specific_date: format(new Date(), 'yyyy-MM-dd') }),
  })

  const { data: notifications } = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: () => notificationsApi.getNotifications(true),
  })

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.full_name}!</Text>
        <Text style={styles.date}>{format(new Date(), 'EEEE, MMMM do, yyyy')}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: '#dbeafe' }]}>
          <Calendar color="#0ea5e9" size={24} />
          <Text style={styles.statValue}>{todaySchedule?.length || 0}</Text>
          <Text style={styles.statLabel}>Today's Classes</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#fef3c7' }]}>
          <Bell color="#f59e0b" size={24} />
          <Text style={styles.statValue}>{notifications?.length || 0}</Text>
          <Text style={styles.statLabel}>Notifications</Text>
        </View>
      </View>

      {/* Today's Schedule */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Schedule</Text>
        {todaySchedule && todaySchedule.length > 0 ? (
          todaySchedule.map((entry: any) => (
            <View
              key={entry.id}
              style={[
                styles.scheduleCard,
                entry.status === 'cancelled' && styles.cancelledCard,
                entry.status === 'rescheduled' && styles.rescheduledCard,
              ]}
            >
              <Text style={styles.subjectName}>{entry.subject_name}</Text>
              <Text style={styles.scheduleTime}>
                {entry.start_time} - {entry.end_time}
              </Text>
              <Text style={styles.scheduleDetails}>
                {entry.teacher_name} • {entry.classroom_name}
              </Text>
              {entry.status !== 'scheduled' && (
                <Text style={styles.statusBadge}>{entry.status.toUpperCase()}</Text>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No classes scheduled for today</Text>
        )}
      </View>

      {/* Recent Notifications */}
      {notifications && notifications.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Notifications</Text>
          {notifications.slice(0, 3).map((notification: any) => (
            <View key={notification.id} style={styles.notificationCard}>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              <Text style={styles.notificationMessage}>{notification.message}</Text>
            </View>
          ))}
        </View>
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
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  date: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  scheduleCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  cancelledCard: {
    borderLeftColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  rescheduledCard: {
    borderLeftColor: '#f59e0b',
    backgroundColor: '#fffbeb',
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
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
  statusBadge: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 8,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    padding: 20,
  },
  notificationCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
})

