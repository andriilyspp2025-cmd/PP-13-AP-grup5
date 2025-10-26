import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { useAuthStore } from '../store/authStore'
import { LogOut, User, Bell, Info } from 'lucide-react-native'

export default function SettingsScreen() {
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout, style: 'destructive' },
      ]
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.content}>
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <View style={styles.card}>
            <View style={styles.profileRow}>
              <User color="#6b7280" size={20} />
              <View style={styles.profileInfo}>
                <Text style={styles.label}>Full Name</Text>
                <Text style={styles.value}>{user?.full_name}</Text>
              </View>
            </View>
            <View style={styles.profileRow}>
              <User color="#6b7280" size={20} />
              <View style={styles.profileInfo}>
                <Text style={styles.label}>Username</Text>
                <Text style={styles.value}>{user?.username}</Text>
              </View>
            </View>
            <View style={styles.profileRow}>
              <User color="#6b7280" size={20} />
              <View style={styles.profileInfo}>
                <Text style={styles.label}>Role</Text>
                <Text style={styles.value}>{user?.role.replace('_', ' ').toUpperCase()}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <Bell color="#6b7280" size={20} />
              <Text style={styles.settingLabel}>Push Notifications</Text>
            </View>
            <View style={styles.settingRow}>
              <Bell color="#6b7280" size={20} />
              <Text style={styles.settingLabel}>Email Notifications</Text>
            </View>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <Info color="#6b7280" size={20} />
              <View style={styles.profileInfo}>
                <Text style={styles.label}>Version</Text>
                <Text style={styles.value}>1.0.0</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut color="white" size={20} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  profileInfo: {
    marginLeft: 12,
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
  },
  value: {
    fontSize: 16,
    color: '#111827',
    marginTop: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabel: {
    fontSize: 16,
    marginLeft: 12,
    color: '#111827',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#ef4444',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
})

