import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationsApi } from '../services/api'
import { format } from 'date-fns'
import { Bell } from 'lucide-react-native'

export default function NotificationsScreen() {
  const queryClient = useQueryClient()

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.getNotifications(),
  })

  const markAsReadMutation = useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
      </View>

      {isLoading ? (
        <Text style={styles.loading}>Loading notifications...</Text>
      ) : notifications && notifications.length > 0 ? (
        <View style={styles.content}>
          {notifications.map((notification: any) => (
            <TouchableOpacity
              key={notification.id}
              style={[styles.notificationCard, !notification.is_read && styles.unreadCard]}
              onPress={() => !notification.is_read && markAsReadMutation.mutate(notification.id)}
            >
              <View style={styles.iconContainer}>
                <Bell color="#0ea5e9" size={20} />
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationMessage}>{notification.message}</Text>
                <Text style={styles.notificationTime}>
                  {format(new Date(notification.created_at), 'MMM d, h:mm a')}
                </Text>
              </View>
              {!notification.is_read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.empty}>
          <Bell color="#9ca3af" size={48} />
          <Text style={styles.emptyText}>No notifications</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  loading: {
    textAlign: 'center',
    padding: 20,
    color: '#6b7280',
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  unreadCard: {
    backgroundColor: '#f0f9ff',
  },
  iconContainer: {
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
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
  notificationTime: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0ea5e9',
    marginLeft: 8,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: 16,
  },
})

