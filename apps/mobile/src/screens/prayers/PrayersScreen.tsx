import React, { useState, useMemo, useCallback, useRef } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import RBSheet from 'react-native-raw-bottom-sheet'
import dayjs from 'dayjs'
import 'dayjs/locale/uz-latn'
import { useTheme } from '../../theme/ThemeContext'
import { spacing, radius, typography } from '../../theme'
import { prayerApi, type Prayer } from '../../api/prayer.api'
import { useAuthStore } from '../../store/auth.store'

dayjs.locale('uz-latn')

const MONTH_NAMES = [
  'Yanvar','Fevral','Mart','Aprel','May','Iyun',
  'Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr',
]

const PRAYER_ICONS: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  bomdod:  { active: 'partly-sunny',   inactive: 'partly-sunny-outline' },
  peshin:  { active: 'sunny',          inactive: 'sunny-outline' },
  asr:     { active: 'sunny',          inactive: 'sunny-outline' },
  shom:    { active: 'cloudy-night',   inactive: 'cloudy-night-outline' },
  xufton:  { active: 'moon',           inactive: 'moon-outline' },
  vitr:    { active: 'star',           inactive: 'star-outline' },
  default: { active: 'ellipse',        inactive: 'ellipse-outline' },
}

type DayGroup = { date: string; prayers: Prayer[] }

export default function PrayersScreen() {
  const { theme } = useTheme()
  const { user } = useAuthStore()
  const qc = useQueryClient()
  const c = theme.colors

  const now = dayjs()
  const [year, setYear] = useState(now.year())
  const [month, setMonth] = useState(now.month())
  const [selectedDay, setSelectedDay] = useState<DayGroup | null>(null)

  const sheetRef = useRef<any>(null)

  const minDate = user?.minPrayerDate ? dayjs(user.minPrayerDate) : null
  const maxDate = user?.maxPrayerDate ? dayjs(user.maxPrayerDate) : null

  const currentMonthStart = dayjs(new Date(year, month, 1))
  const isPrevDisabled = minDate ? !currentMonthStart.isAfter(minDate.startOf('month')) : false
  const isNextDisabled = maxDate ? !currentMonthStart.isBefore(maxDate.startOf('month')) : false

  const fromDate = useMemo(() => dayjs(new Date(year, month, 1)).format('YYYY-MM-DD'), [year, month])
  const toDate = useMemo(() => dayjs(new Date(year, month + 1, 0)).format('YYYY-MM-DD'), [year, month])

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['prayers.list', fromDate, toDate],
    queryFn: () => prayerApi.list(fromDate, toDate),
  })

  const completeMutation = useMutation({
    mutationFn: prayerApi.complete,
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ['prayers.list', fromDate, toDate] })
      setSelectedDay(prev =>
        prev ? { ...prev, prayers: prev.prayers.map(p => p.id === id ? { ...p, isCompleted: true } : p) } : prev
      )
    },
  })

  const dayGroups = useMemo<DayGroup[]>(() => {
    if (!data?.prayers) return []
    const map = new Map<string, Prayer[]>()
    data.prayers.forEach((p) => {
      const d = map.get(p.date) ?? []
      d.push(p)
      map.set(p.date, d)
    })
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, prayers]) => ({
        date,
        prayers: prayers.sort((a, b) => a.prayerType.order_no - b.prayerType.order_no),
      }))
  }, [data])

  const completedCount = data ? Number(data.completedCount) : 0
  const totalCount = data ? Number(data.totalPrayers) : 0
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  const handleComplete = async (id: string) => {
    try {
      await completeMutation.mutateAsync(id)
    } catch {
      Alert.alert('Xato', 'Namozni belgilashda xato yuz berdi')
    }
  }

  const iconMuted = theme.dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'

  const renderDayRow = useCallback(({ item }: { item: DayGroup }) => {
    const d = dayjs(item.date)
    const isToday = d.isSame(dayjs(), 'day')
    const dayCompleted = item.prayers.filter(p => p.isCompleted).length
    const dayTotal = item.prayers.length
    const allDone = dayCompleted === dayTotal && dayTotal > 0

    return (
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => { setSelectedDay(item); sheetRef.current?.open() }}
        style={[
          styles.dayRow,
          { backgroundColor: c.card, borderColor: isToday ? c.primaryBorder : c.border },
          allDone && { backgroundColor: theme.dark ? 'rgba(33,105,116,0.12)' : 'rgba(33,105,116,0.08)' },
        ]}
      >
        <View style={styles.dayLeft}>
          <Text style={[styles.dayNum, { color: isToday ? c.primary : c.text }]}>{d.date()}</Text>
          <Text style={[styles.dayWeek, { color: c.textMuted }]}>{d.format('ddd')}</Text>
        </View>

        <View style={styles.prayerIcons}>
          {item.prayers.map((prayer) => {
            const key = prayer.prayerType.key?.toLowerCase() ?? 'default'
            const icons = PRAYER_ICONS[key] ?? PRAYER_ICONS.default
            return (
              <Ionicons
                key={prayer.id}
                name={prayer.isCompleted ? icons.active : icons.inactive}
                size={17}
                color={prayer.isCompleted ? c.primary : iconMuted}
              />
            )
          })}
        </View>

        <View style={styles.dayRight}>
          <Text style={[styles.dayProgress, { color: allDone ? c.primary : c.textSecondary }]}>
            {dayCompleted}/{dayTotal}
          </Text>
          {allDone && <Ionicons name="checkmark-circle" size={16} color={c.primary} />}
        </View>
      </TouchableOpacity>
    )
  }, [c, theme.dark])

  const sheetPrayers = selectedDay?.prayers ?? []
  const sheetHeight = 120 + sheetPrayers.length * 68 + 60

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: c.border }]}>
        <Text style={[styles.screenTitle, { color: c.text }]}>Qazo namozlar</Text>
        <Text style={[styles.screenSub, { color: c.textSecondary }]}>{completedCount}/{totalCount} bajarilgan</Text>
      </View>

      {/* Month Navigator */}
      <View style={[styles.monthNav, { backgroundColor: c.surface, borderBottomColor: c.border }]}>
        <TouchableOpacity style={[styles.navBtn, isPrevDisabled && styles.navBtnDisabled]} onPress={prevMonth} disabled={isPrevDisabled}>
          <Ionicons name="chevron-back" size={20} color={isPrevDisabled ? c.textMuted : c.text} />
        </TouchableOpacity>
        <View style={styles.monthCenter}>
          <Text style={[styles.monthLabel, { color: c.text }]}>{MONTH_NAMES[month]} {year}</Text>
          <View style={[styles.progressTrack, { backgroundColor: c.border }]}>
            <View style={[styles.progressFill, { backgroundColor: c.primary, width: `${progress}%` as any }]} />
          </View>
          <Text style={[styles.progressLabel, { color: c.textMuted }]}>{progress}% bajarilgan</Text>
        </View>
        <TouchableOpacity style={[styles.navBtn, isNextDisabled && styles.navBtnDisabled]} onPress={nextMonth} disabled={isNextDisabled}>
          <Ionicons name="chevron-forward" size={20} color={isNextDisabled ? c.textMuted : c.text} />
        </TouchableOpacity>
      </View>

      {/* List */}
      {isLoading ? (
        <View style={styles.loadingWrap}><ActivityIndicator size="large" color={c.primary} /></View>
      ) : dayGroups.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Ionicons name="calendar-outline" size={48} color={c.textMuted} />
          <Text style={[styles.emptyText, { color: c.textSecondary }]}>Bu oyda namozlar yo'q</Text>
        </View>
      ) : (
        <FlatList
          data={dayGroups}
          keyExtractor={(item) => item.date}
          renderItem={renderDayRow}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshing={isLoading}
          onRefresh={refetch}
        />
      )}

      {/* Bottom Sheet */}
      <RBSheet
        ref={sheetRef}
        height={Math.min(sheetHeight, 560)}
        openDuration={280}
        closeDuration={220}
        closeOnDragDown
        closeOnPressMask
        dragFromTopOnly
        customStyles={{
          wrapper: { backgroundColor: 'rgba(0,0,0,0.45)' },
          container: {
            backgroundColor: c.surface,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderWidth: 1,
            borderBottomWidth: 0,
            borderColor: c.border,
          },
          draggableIcon: { backgroundColor: c.textMuted, width: 40, height: 4, borderRadius: 2 },
        }}
      >
        {selectedDay && (
          <View style={styles.sheetContent}>
            {/* Title */}
            <View style={[styles.sheetTitleRow, { borderBottomColor: c.border }]}>
              <View>
                <Text style={[styles.sheetTitle, { color: c.text }]}>
                  {dayjs(selectedDay.date).format('D MMMM, YYYY')}
                </Text>
                <Text style={[styles.sheetSub, { color: c.textSecondary }]}>
                  {selectedDay.prayers.filter(p => p.isCompleted).length}/{selectedDay.prayers.length} bajarilgan
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => sheetRef.current?.close()}
                style={[styles.sheetCloseBtn, { backgroundColor: theme.dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={18} color={c.text} />
              </TouchableOpacity>
            </View>

            {/* Prayer list */}
            <View style={{ paddingHorizontal: spacing.base, gap: spacing.sm }}>
            {selectedDay.prayers.map((prayer) => {
              const key = prayer.prayerType.key?.toLowerCase() ?? 'default'
              const icons = PRAYER_ICONS[key] ?? PRAYER_ICONS.default
              return (
                <TouchableOpacity
                  key={prayer.id}
                  activeOpacity={0.75}
                  onPress={() => {
                    if (!prayer.isCompleted) {
                      Alert.alert(
                        `${prayer.prayerType.name_uz} namozi`,
                        'O\'qilgan qilmoqchimisiz?',
                        [
                          { text: 'Bekor', style: 'cancel' },
                          { text: 'Ha', onPress: () => handleComplete(prayer.id) },
                        ]
                      )
                    }
                  }}
                  style={[
                    styles.prayerItem,
                    {
                      backgroundColor: prayer.isCompleted ? c.primaryDim : (theme.dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'),
                      borderColor: prayer.isCompleted ? c.primaryBorder : c.border,
                    },
                  ]}
                >
                  <View style={[styles.prayerIconBadge, {
                    backgroundColor: prayer.isCompleted ? c.primaryDim : (theme.dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'),
                  }]}>
                    <Ionicons
                      name={prayer.isCompleted ? icons.active : icons.inactive}
                      size={20}
                      color={prayer.isCompleted ? c.primary : c.textMuted}
                    />
                  </View>
                  <Text style={[styles.prayerName, { color: c.text }]}>{prayer.prayerType.name_uz}</Text>
                  {prayer.isCompleted ? (
                    <View style={[styles.doneBadge, { backgroundColor: c.primaryDim }]}>
                      <Ionicons name="checkmark" size={14} color={c.primary} />
                      <Text style={[styles.doneText, { color: c.primary }]}>O'qilgan</Text>
                    </View>
                  ) : (
                    <View style={[styles.doneBadge, { backgroundColor: theme.dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }]}>
                      <Text style={[styles.doneText, { color: c.textMuted }]}>Belgilash</Text>
                    </View>
                  )}
                </TouchableOpacity>
              )
            })}
            </View>
          </View>
        )}
      </RBSheet>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: spacing.base, paddingTop: spacing.base, paddingBottom: spacing.md, borderBottomWidth: 1 },
  screenTitle: { fontSize: typography.fontSizes.xl, fontWeight: '800' },
  screenSub: { fontSize: typography.fontSizes.sm, marginTop: 2 },

  monthNav: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.sm, borderBottomWidth: 1 },
  navBtn: { padding: spacing.sm },
  navBtnDisabled: { opacity: 0.3 },
  monthCenter: { flex: 1, alignItems: 'center', gap: 4 },
  monthLabel: { fontSize: typography.fontSizes.md, fontWeight: '700' },
  progressTrack: { width: '80%', height: 4, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  progressLabel: { fontSize: typography.fontSizes.xs },

  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.sm },
  emptyText: { fontSize: typography.fontSizes.base },

  list: { padding: spacing.md },

  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    minHeight: 64,
  },
  dayLeft: { width: 40, alignItems: 'center' },
  dayNum: { fontSize: 20, fontWeight: '700' },
  dayWeek: { fontSize: 10, fontWeight: '500', textTransform: 'uppercase' },
  prayerIcons: { flex: 1, flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, paddingHorizontal: spacing.sm },
  dayRight: { width: 48, alignItems: 'center', gap: 4 },
  dayProgress: { fontSize: typography.fontSizes.xs, fontWeight: '600' },

  // Sheet content
  sheetContent: { gap: spacing.sm },
  sheetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    marginBottom: spacing.xs,
  },
  sheetCloseBtn: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  sheetTitle: { fontSize: typography.fontSizes.lg, fontWeight: '800' },
  sheetSub: { fontSize: typography.fontSizes.sm, marginTop: 2 },

  prayerItem: { flexDirection: 'row', alignItems: 'center', borderRadius: radius.md, borderWidth: 1, padding: spacing.md, gap: spacing.sm },
  prayerIconBadge: { width: 40, height: 40, borderRadius: radius.md, justifyContent: 'center', alignItems: 'center' },
  prayerName: { flex: 1, fontSize: typography.fontSizes.base, fontWeight: '600' },
  doneBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full },
  doneText: { fontSize: typography.fontSizes.xs, fontWeight: '600' },
})
