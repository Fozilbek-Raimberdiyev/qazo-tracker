import React from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useQuery } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { useTheme } from '../../theme/ThemeContext'
import { spacing, radius, typography } from '../../theme'
import { statisticApi } from '../../api/statistic.api'
import { useAuthStore } from '../../store/auth.store'
import ProgressRing from '../../components/ProgressRing'
import type { TabParams } from '../../navigation'

export default function DashboardScreen() {
  const { theme } = useTheme()
  const { user } = useAuthStore()
  const navigation = useNavigation<BottomTabNavigationProp<TabParams>>()
  const c = theme.colors

  const {
    data: prayerStat,
    isLoading: loadingPrayer,
    refetch: refetchPrayer,
  } = useQuery({
    queryKey: ['stat.prayers'],
    queryFn: statisticApi.prayersCount,
    enabled: !!user,
  })

  const {
    data: fastingStat,
    isLoading: loadingFasting,
    refetch: refetchFasting,
  } = useQuery({
    queryKey: ['stat.fasting'],
    queryFn: statisticApi.fastingCount,
    enabled: !!user,
  })

  const isLoading = loadingPrayer || loadingFasting
  const onRefresh = () => { refetchPrayer(); refetchFasting() }

  const pTotal = prayerStat ? Number(prayerStat.totalPrayers) : 0
  const pDone = prayerStat ? Number(prayerStat.completedPrayers) : 0
  const pLeft = prayerStat ? Number(prayerStat.uncompletedPrayers) : 0
  const fTotal = fastingStat ? Number(fastingStat.totalFasting) : 0
  const fDone = fastingStat ? Number(fastingStat.completedFasting) : 0
  const fLeft = fastingStat ? Number(fastingStat.uncompletedFasting) : 0

  const prayerProgress = pTotal > 0 ? Math.round((pDone / pTotal) * 100) : 0
  const fastingProgress = fTotal > 0 ? Math.round((fDone / fTotal) * 100) : 0

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 5) return 'Xayrli tun'
    if (h < 12) return 'Xayrli tong'
    if (h < 17) return 'Xayrli kun'
    if (h < 21) return 'Xayrli oqshom'
    return 'Xayrli kech'
  }

  const displayName = user?.firstName || user?.email?.split('@')[0] || 'Foydalanuvchi'

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            tintColor={c.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: c.textSecondary }]}>{greeting()},</Text>
            <Text style={[styles.username, { color: c.text }]}>{displayName}</Text>
          </View>
          <View style={[styles.avatarCircle, { backgroundColor: c.primaryDim, borderColor: c.primaryBorder }]}>
            <Text style={[styles.avatarText, { color: c.primary }]}>
              {displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Stats Grid */}
        {isLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={c.primary} />
          </View>
        ) : (
          <>
            {/* Prayers Card */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Prayers')}
              style={[styles.statCard, { backgroundColor: c.card, borderColor: c.border }]}
            >
              <View style={styles.statCardHeader}>
                <View style={[styles.iconBadge, { backgroundColor: 'rgba(250,204,21,0.12)' }]}>
                  <Ionicons name="sunny" size={20} color="#facc15" />
                </View>
                <View>
                  <Text style={[styles.cardTitle, { color: c.text }]}>Qazo namozlar</Text>
                  <Text style={[styles.cardSub, { color: c.textSecondary }]}>
                    {pTotal} ta jami
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={c.textMuted} style={styles.chevron} />
              </View>

              <View style={styles.statRow}>
                <ProgressRing
                  size={90}
                  strokeWidth={8}
                  progress={prayerProgress}
                  color={c.primary}
                  label={`${prayerProgress}%`}
                  sublabel="bajarildi"
                />
                <View style={styles.statMeta}>
                  <StatItem label="Jami" value={pTotal} color={c.text} />
                  <StatItem label="Bajarilgan" value={pDone} color={c.success} />
                  <StatItem label="Qolgan" value={pLeft} color={c.warning} />
                </View>
              </View>
            </TouchableOpacity>

            {/* Fasting Card */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Fasting')}
              style={[styles.statCard, { backgroundColor: c.card, borderColor: c.border }]}
            >
              <View style={styles.statCardHeader}>
                <View style={[styles.iconBadge, { backgroundColor: 'rgba(139,92,246,0.12)' }]}>
                  <Ionicons name="moon" size={20} color="#a78bfa" />
                </View>
                <View>
                  <Text style={[styles.cardTitle, { color: c.text }]}>Qazo ro'zalar</Text>
                  <Text style={[styles.cardSub, { color: c.textSecondary }]}>
                    {fTotal} ta jami
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={c.textMuted} style={styles.chevron} />
              </View>

              <View style={styles.statRow}>
                <ProgressRing
                  size={90}
                  strokeWidth={8}
                  progress={fastingProgress}
                  color="#a78bfa"
                  label={`${fastingProgress}%`}
                  sublabel="bajarildi"
                />
                <View style={styles.statMeta}>
                  <StatItem label="Jami" value={fTotal} color={c.text} />
                  <StatItem label="Tutilgan" value={fDone} color={c.success} />
                  <StatItem label="Qolgan" value={fLeft} color={c.warning} />
                </View>
              </View>
            </TouchableOpacity>

            {/* Motivational card */}
            <View style={[styles.motCard, { backgroundColor: c.card, borderColor: c.border }]}>
              <Text style={[styles.motTitle, { color: c.text }]}>
                Hadis
              </Text>
              <Text style={[styles.motText, { color: c.textSecondary }]}>
                "Kim Ramazon oyida imon bilan, savob umidida (ixlos bilan) ro‘za tutsa, uning o‘tgan gunohlari kechiriladi"
              </Text>
              <Text style={[styles.motSource, { color: c.textMuted }]}>— Buxoriy va Muslim rivoyati</Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

function StatItem({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={siStyles.wrap}>
      <Text style={[siStyles.value, { color }]}>{value}</Text>
      <Text style={siStyles.label}>{label}</Text>
    </View>
  )
}

const siStyles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  value: { fontSize: 22, fontWeight: '700' },
  label: { fontSize: 11, color: '#6b7280', marginTop: 2 },
})

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: spacing.base, paddingBottom: spacing['2xl'] },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  greeting: { fontSize: typography.fontSizes.base },
  username: { fontSize: typography.fontSizes.xl, fontWeight: '800' },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '700' },

  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  bannerText: { flex: 1, fontSize: typography.fontSizes.sm, lineHeight: 20 },

  loadingWrap: { padding: spacing['3xl'], alignItems: 'center' },

  statCard: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.base,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconBadge: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: { fontSize: typography.fontSizes.md, fontWeight: '700' },
  cardSub: { fontSize: typography.fontSizes.sm },
  chevron: { marginLeft: 'auto' },

  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  statMeta: { flex: 1, flexDirection: 'row', justifyContent: 'space-around' },

  motCard: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.base,
    gap: spacing.sm,
  },
  motTitle: { fontSize: typography.fontSizes.base, fontWeight: '700' },
  motText: { fontSize: typography.fontSizes.sm, lineHeight: 22, fontStyle: 'italic' },
  motSource: { fontSize: typography.fontSizes.xs },
})
