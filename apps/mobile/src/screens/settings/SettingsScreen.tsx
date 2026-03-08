import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useTheme } from '../../theme/ThemeContext'
import { spacing, radius, typography } from '../../theme'
import { useAuthStore } from '../../store/auth.store'
import { apiClient } from '../../api/client'

export default function SettingsScreen() {
  const { theme, isDark, toggleTheme } = useTheme()
  const { user, logout, setUser } = useAuthStore()
  const c = theme.colors

  const [editMode, setEditMode] = useState(false)
  const [firstName, setFirstName] = useState(user?.firstName ?? '')
  const [lastName, setLastName] = useState(user?.lastName ?? '')
  const [saving, setSaving] = useState(false)

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    user?.email?.split('@')[0] ||
    'Foydalanuvchi'

  const initials = displayName
    .split(' ')
    .map((w) => w[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('')

  const handleSave = async () => {
    setSaving(true)
    try {
      if (!user?.id) return
      const res = await apiClient.put(`/users/${user.id}`, {
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
      })
      setUser({ ...user, ...res.data })
      setEditMode(false)
    } catch (err: any) {
      Alert.alert('Xato', err?.response?.data?.message ?? 'Saqlashda xato yuz berdi')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    Alert.alert('Chiqish', 'Hisobdan chiqmoqchimisiz?', [
      { text: 'Bekor', style: 'cancel' },
      { text: 'Chiqish', style: 'destructive', onPress: logout },
    ])
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={[styles.pageTitle, { color: c.text }]}>Sozlamalar</Text>

        {/* Profile Card */}
        <LinearGradient
          colors={theme.dark ? ['#0d1f12', '#141414'] : ['#dcfce7', '#ffffff']}
          style={[styles.profileCard, { borderColor: c.primaryBorder }]}
        >
          <View style={[styles.avatar, { backgroundColor: c.primaryDim, borderColor: c.primaryBorder }]}>
            <Text style={[styles.avatarText, { color: c.primary }]}>{initials}</Text>
          </View>

          {editMode ? (
            <View style={styles.editFields}>
              <View style={styles.editRow}>
                <TextInput
                  style={[styles.editInput, { backgroundColor: c.input, borderColor: c.border, color: c.text }]}
                  placeholder="Ism"
                  placeholderTextColor={c.textMuted}
                  value={firstName}
                  onChangeText={setFirstName}
                />
                <TextInput
                  style={[styles.editInput, { backgroundColor: c.input, borderColor: c.border, color: c.text }]}
                  placeholder="Familiya"
                  placeholderTextColor={c.textMuted}
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
              <View style={styles.editActions}>
                <TouchableOpacity
                  style={[styles.editActionBtn, { backgroundColor: c.border }]}
                  onPress={() => {
                    setFirstName(user?.firstName ?? '')
                    setLastName(user?.lastName ?? '')
                    setEditMode(false)
                  }}
                >
                  <Text style={[styles.editActionTxt, { color: c.text }]}>Bekor</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.editActionBtn, { backgroundColor: c.primary }]}
                  onPress={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator color="#000" size="small" />
                  ) : (
                    <Text style={[styles.editActionTxt, { color: '#000' }]}>Saqlash</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: c.text }]}>{displayName}</Text>
              <Text style={[styles.profileEmail, { color: c.textSecondary }]}>{user?.email}</Text>
              <TouchableOpacity
                style={[styles.editBtn, { borderColor: c.primaryBorder, backgroundColor: c.primaryDim }]}
                onPress={() => setEditMode(true)}
              >
                <Ionicons name="pencil" size={14} color={c.primary} />
                <Text style={[styles.editBtnTxt, { color: c.primary }]}>Tahrirlash</Text>
              </TouchableOpacity>
            </View>
          )}
        </LinearGradient>

        {/* Stats summary */}
        <View style={[styles.statsRow, { backgroundColor: c.card, borderColor: c.border }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statVal, { color: c.text }]}>{user?.qazoPrayersCount ?? 0}</Text>
            <Text style={[styles.statLbl, { color: c.textSecondary }]}>Namozlar</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: c.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statVal, { color: c.text }]}>{user?.qazoFastingCount ?? 0}</Text>
            <Text style={[styles.statLbl, { color: c.textSecondary }]}>Ro'zalar</Text>
          </View>
        </View>

        {/* Appearance Section */}
        <Text style={[styles.sectionTitle, { color: c.textSecondary }]}>Ko'rinish</Text>
        <View style={[styles.section, { backgroundColor: c.card, borderColor: c.border }]}>
          <View style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: theme.dark ? 'rgba(250,204,21,0.12)' : 'rgba(250,204,21,0.15)' }]}>
              <Ionicons name={isDark ? 'moon' : 'sunny'} size={18} color="#facc15" />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: c.text }]}>
                {isDark ? 'Qorong\'u rejim' : 'Yorug\' rejim'}
              </Text>
              <Text style={[styles.settingDesc, { color: c.textMuted }]}>
                Ilova ko'rinishini o'zgartiring
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#e5e7eb', true: `${c.primary}50` }}
              thumbColor={isDark ? c.primary : '#f3f4f6'}
            />
          </View>
        </View>

        {/* Account Section */}
        <Text style={[styles.sectionTitle, { color: c.textSecondary }]}>Hisob</Text>
        <View style={[styles.section, { backgroundColor: c.card, borderColor: c.border }]}>
          <View style={[styles.settingRow, styles.rowWithBorder, { borderBottomColor: c.border }]}>
            <View style={[styles.settingIcon, { backgroundColor: 'rgba(59,130,246,0.12)' }]}>
              <Ionicons name="mail-outline" size={18} color="#3b82f6" />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: c.text }]}>Email</Text>
              <Text style={[styles.settingDesc, { color: c.textMuted }]}>{user?.email}</Text>
            </View>
            {user?.isEmailVerified && (
              <View style={[styles.verifiedBadge, { backgroundColor: 'rgba(19,236,91,0.12)' }]}>
                <Ionicons name="checkmark-circle" size={14} color={c.primary} />
                <Text style={[styles.verifiedText, { color: c.primary }]}>Tasdiqlangan</Text>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.settingRow} onPress={handleLogout} activeOpacity={0.7}>
            <View style={[styles.settingIcon, { backgroundColor: 'rgba(239,68,68,0.12)' }]}>
              <Ionicons name="log-out-outline" size={18} color="#ef4444" />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: '#ef4444' }]}>Chiqish</Text>
              <Text style={[styles.settingDesc, { color: c.textMuted }]}>
                Hisobdan chiqish
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={c.textMuted} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.version, { color: c.textMuted }]}>Qazo Tracker v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: spacing.base, paddingBottom: spacing['2xl'] },
  pageTitle: { fontSize: typography.fontSizes.xl, fontWeight: '800', marginBottom: spacing.base },

  // Profile
  profileCard: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 22, fontWeight: '800' },
  profileInfo: { flex: 1, gap: spacing.xs },
  profileName: { fontSize: typography.fontSizes.md, fontWeight: '700' },
  profileEmail: { fontSize: typography.fontSizes.sm },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    marginTop: 4,
  },
  editBtnTxt: { fontSize: typography.fontSizes.xs, fontWeight: '600' },
  editFields: { flex: 1, gap: spacing.sm },
  editRow: { flexDirection: 'row', gap: spacing.sm },
  editInput: {
    flex: 1,
    height: 40,
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    fontSize: typography.fontSizes.sm,
  },
  editActions: { flexDirection: 'row', gap: spacing.sm },
  editActionBtn: {
    flex: 1,
    height: 38,
    borderRadius: radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editActionTxt: { fontWeight: '600', fontSize: typography.fontSizes.sm },

  // Stats
  statsRow: {
    flexDirection: 'row',
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: typography.fontSizes.xl, fontWeight: '800' },
  statLbl: { fontSize: typography.fontSizes.xs, marginTop: 2 },
  statDivider: { width: 1, marginHorizontal: spacing.md },

  // Settings sections
  sectionTitle: {
    fontSize: typography.fontSizes.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },
  section: {
    borderRadius: radius.xl,
    borderWidth: 1,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
    minHeight: 64,
  },
  rowWithBorder: { borderBottomWidth: 1 },
  settingIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingContent: { flex: 1 },
  settingLabel: { fontSize: typography.fontSizes.base, fontWeight: '600' },
  settingDesc: { fontSize: typography.fontSizes.xs, marginTop: 2 },

  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  verifiedText: { fontSize: 10, fontWeight: '600' },

  version: { textAlign: 'center', fontSize: typography.fontSizes.xs, marginTop: spacing.sm },
})
