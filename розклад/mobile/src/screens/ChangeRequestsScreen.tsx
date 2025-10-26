import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { changeRequestApi } from '../services/api'
import { format } from 'date-fns'

export default function ChangeRequestsScreen() {
  const { data: requests, isLoading } = useQuery({
    queryKey: ['change-requests'],
    queryFn: () => changeRequestApi.getRequests(),
  })

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Change Requests</Text>
      </View>

      {isLoading ? (
        <Text style={styles.loading}>Loading requests...</Text>
      ) : requests && requests.length > 0 ? (
        <View style={styles.content}>
          {requests.map((request: any) => (
            <View key={request.id} style={styles.requestCard}>
              <View style={styles.badges}>
                <View style={[styles.badge, styles[`${request.status}Badge`]]}>
                  <Text style={styles.badgeText}>{request.status.toUpperCase()}</Text>
                </View>
                <View style={[styles.badge, styles.typeBadge]}>
                  <Text style={styles.badgeText}>{request.change_type.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={styles.requestDate}>
                Date: {format(new Date(request.requested_date), 'MMM d, yyyy')}
              </Text>
              <Text style={styles.requestReason}>{request.reason}</Text>
              {request.admin_comment && (
                <Text style={styles.adminComment}>Admin: {request.admin_comment}</Text>
              )}
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.emptyText}>No change requests found</Text>
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
  requestCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pendingBadge: {
    backgroundColor: '#fef3c7',
  },
  approvedBadge: {
    backgroundColor: '#d1fae5',
  },
  rejectedBadge: {
    backgroundColor: '#fee2e2',
  },
  typeBadge: {
    backgroundColor: '#dbeafe',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  requestDate: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  requestReason: {
    fontSize: 14,
    color: '#111827',
  },
  adminComment: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    fontStyle: 'italic',
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    padding: 20,
  },
})

