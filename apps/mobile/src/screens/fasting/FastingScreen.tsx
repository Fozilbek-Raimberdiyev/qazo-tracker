import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import RBSheet from 'react-native-raw-bottom-sheet'
import dayjs from 'dayjs'
import 'dayjs/locale/uz-latn'
import { useTheme } from '../../theme/ThemeContext'
import { spacing, radius, typography } from '../../theme'
import { fastingApi, type Fasting } from '../../api/fasting.api'
import { useAuthStore } from '../../store/auth.store'
import ProgressRing from '../../components/ProgressRing'

dayjs.locale('uz-latn')

const SCREEN_WIDTH = Dimensions.get('window').width
const CARD_COLS = 4
const CARD_GAP = 8
const CARD_SIZE = (SCREEN_WIDTH - spacing.base * 2 - CARD_GAP * (CARD_COLS - 1)) / CARD_COLS

export default function FastingScreen() {
  const { theme } = useTheme()
  const { user } = useAuthStore()
  const qc = useQueryClient()
  const c = theme.colors

  const minYear = user?.minFastingDate ? new Date(user.minFastingDate).getFullYear() : 2020
  const maxYear = user?.maxFastingDate ? new Date(user.maxFastingDate).getFullYear() : new Date().getFullYear()
  const [year, setYear] = useState(maxYear)
  const [selected, setSelected] = useState<Fasting | null>(null)
  const sheetRef = useRef<any>(null)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['fasting.list', year],
    queryFn: () => fastingApi.list(year),
  })

  const completeMutation = useMutation({
    mutationFn: fastingApi.complete,
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ['fasting.list', year] })
      setSelected(prev => prev ? { ...prev, isCompleted: true } : prev)
      sheetRef.current?.close()
    },
  })

  const openSheet = (item: Fasting) => {
    setSelected(item)
    sheetRef.current?.open()
  }

  const handleComplete = () => {
    if (!selected) return
    Alert.alert(
      `Ramazon ${selected.day_of_ramadan}-kun`,
      "Ro'za tutilgan qilmoqchimisiz?",
      [
        { text: 'Bekor', style: 'cancel' },
        {
          text: 'Tutilgan',
          onPress: async () => {
            try {
              await completeMutation.mutateAsync(selected.id)
            } catch {
              Alert.alert('Xato', "Ro'zani belgilashda xato")
            }
          },
        },
      ]
    )
  }

  const list = data?.fastingList ?? []
  const total = data?.totalCount ?? 0
  const completed = data?.completedCount ?? 0
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0

  const renderItem = ({ item }: { item: Fasting }) => (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => openSheet(item)}
      style={[
        styles.dayCard,
        {
          width: CARD_SIZE,
          backgroundColor: item.isCompleted
            ? 'rgba(33,105,116,0.12)'
            : theme.dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
          borderColor: item.isCompleted ? 'rgba(33,105,116,0.35)' : c.border,
        },
      ]}
    >
      <View style={[
        styles.moonBadge,
        { backgroundColor: item.isCompleted ? 'rgba(33,105,116,0.2)' : 'transparent' },
      ]}>
        <Text style={styles.moonEmoji}>{item.isCompleted ? '🌙' : '○'}</Text>
      </View>

      <Text style={[styles.ramadanDay, { color: item.isCompleted ? c.primary : c.text }]}>
        {item.day_of_ramadan?.toString().padStart(2, '0')}
      </Text>

      <Text style={[styles.ramadanLabel, { color: c.textMuted }]}>Ram.</Text>

      <Text style={[styles.dateLabel, { color: c.textMuted }]} numberOfLines={1}>
        {dayjs(item.date).format('D MMM')}
      </Text>

      {item.isCompleted && (
        <View style={styles.checkMark}>
          <Ionicons name="checkmark-circle" size={12} color={c.primary} />
        </View>
      )}
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: c.border }]}>
        <Text style={[styles.screenTitle, { color: c.text }]}>Qazo ro'zalar</Text>
        <Text style={[styles.screenSub, { color: c.textSecondary }]}>
          {completed}/{total} tutilgan
        </Text>
      </View>

      {/* Year nav + progress */}
      <View style={[styles.yearNav, { backgroundColor: c.surface, borderBottomColor: c.border }]}>
        <TouchableOpacity
          style={[styles.navBtn, year <= minYear && styles.navBtnDisabled]}
          onPress={() => setYear(y => y - 1)}
          disabled={year <= minYear}
        >
          <Ionicons name="chevron-back" size={20} color={year <= minYear ? c.textMuted : c.text} />
        </TouchableOpacity>

        <View style={styles.yearCenter}>
          <View style={styles.yearLabelRow}>
            <ProgressRing size={64} strokeWidth={6} progress={progress} color={c.primary} />
            <View style={styles.yearInfo}>
              <Text style={[styles.yearLabel, { color: c.text }]}>{year} yil</Text>
              {list[0]?.hijri_year && (
                <Text style={[styles.hijriLabel, { color: c.primary }]}>
                  {list[0].hijri_year} Hijri
                </Text>
              )}
              <Text style={[styles.progressTxt, { color: c.textSecondary }]}>
                {progress}% bajarildi
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.navBtn, year >= maxYear && styles.navBtnDisabled]}
          onPress={() => setYear(y => y + 1)}
          disabled={year >= maxYear}
        >
          <Ionicons name="chevron-forward" size={20} color={year >= maxYear ? c.textMuted : c.text} />
        </TouchableOpacity>
      </View>

      {/* Legend */}
      <View style={[styles.legend, { borderBottomColor: c.border }]}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: c.primary }]} />
          <Text style={[styles.legendLabel, { color: c.textSecondary }]}>Tutilgan</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: c.border }]} />
          <Text style={[styles.legendLabel, { color: c.textSecondary }]}>Tutilmagan</Text>
        </View>
        <Text style={[styles.legendCount, { color: c.textMuted }]}>{total} ta kun</Text>
      </View>

      {/* Grid */}
      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={c.primary} />
        </View>
      ) : list.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyEmoji}>🌙</Text>
          <Text style={[styles.emptyTitle, { color: c.text }]}>Bu yilda ro'zalar yo'q</Text>
          <Text style={[styles.emptyText, { color: c.textSecondary }]}>
            Boshqa yilni tanlang
          </Text>
        </View>
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={CARD_COLS}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.gridRow}
          showsVerticalScrollIndicator={false}
          refreshing={isLoading}
          onRefresh={refetch}
        />
      )}

      {/* Bottom Sheet */}
      <RBSheet
        ref={sheetRef}
        height={360}
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
        {selected && (
          <View style={styles.sheetContent}>
            {/* Title */}
            <View style={[styles.sheetTitleRow, { borderBottomColor: c.border }]}>
              <Text style={[styles.sheetTitle, { color: c.text }]}>
                {selected.day_of_ramadan}-Ramazon kuni
              </Text>
              <TouchableOpacity
                onPress={() => sheetRef.current?.close()}
                style={[styles.sheetCloseBtn, { backgroundColor: theme.dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={18} color={c.text} />
              </TouchableOpacity>
            </View>

            {/* Info row */}
            <View style={[styles.sheetInfoRow, {
              backgroundColor: selected.isCompleted ? 'rgba(33,105,116,0.08)' : (theme.dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'),
              borderColor: selected.isCompleted ? 'rgba(33,105,116,0.25)' : c.border,
            }]}>
              <View style={styles.sheetDayBadge}>
                <Text style={[styles.sheetDayNum, { color: selected.isCompleted ? c.primary : c.text }]}>
                  {selected.day_of_ramadan?.toString().padStart(2, '0')}
                </Text>
                <Text style={[styles.sheetDaySub, { color: c.textMuted }]}>Ramazon</Text>
              </View>
              <View style={styles.sheetMeta}>
                <Text style={[styles.sheetDate, { color: c.text }]}>
                  {dayjs(selected.date).format('D MMMM, YYYY')}
                </Text>
                <Text style={[styles.sheetHijri, { color: c.primary }]}>
                  {selected.hijri_date}
                </Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: selected.isCompleted ? 'rgba(33,105,116,0.15)' : 'rgba(100,100,100,0.12)' },
                ]}>
                  <Ionicons
                    name={selected.isCompleted ? 'checkmark-circle' : 'time-outline'}
                    size={13}
                    color={selected.isCompleted ? c.primary : c.textMuted}
                  />
                  <Text style={[styles.statusText, { color: selected.isCompleted ? c.primary : c.textMuted }]}>
                    {selected.isCompleted ? "Ro'za tutilgan" : "Ro'za tutilmagan"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Niyat duosi */}
            {!selected.isCompleted && (
              <View style={[styles.niyatCard, { backgroundColor: c.card, borderColor: c.primaryBorder }]}>
                <Text style={[styles.niyatTitle, { color: c.primary }]}>Niyat</Text>
                <Text style={[styles.niyatText, { color: c.textSecondary }]}>
                  {selected.day_of_ramadan}-Ramazon kunining qazo ro'zasini tutmoqni niyat qildim
                </Text>
              </View>
            )}

            {/* Action */}
            {!selected.isCompleted ? (
              <TouchableOpacity
                style={[styles.completeBtn, { backgroundColor: c.primary }]}
                onPress={handleComplete}
                disabled={completeMutation.isPending}
                activeOpacity={0.85}
              >
                {completeMutation.isPending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                    <Text style={styles.completeBtnText}>Tutilgan qilish</Text>
                  </>
                )}
              </TouchableOpacity>
            ) : (
              <View style={[styles.doneWrap, { backgroundColor: 'rgba(33,105,116,0.1)' }]}>
                <Ionicons name="checkmark-circle" size={22} color={c.primary} />
                <Text style={[styles.doneLabel, { color: c.primary }]}>Ro'za tutilgan</Text>
              </View>
            )}
          </View>
        )}
      </RBSheet>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
  },
  screenTitle: { fontSize: typography.fontSizes.xl, fontWeight: '800' },
  screenSub: { fontSize: typography.fontSizes.sm, marginTop: 2 },

  yearNav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
  },
  navBtn: { padding: spacing.sm },
  navBtnDisabled: { opacity: 0.3 },
  yearCenter: { flex: 1, alignItems: 'center' },
  yearLabelRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  yearInfo: { gap: 2 },
  yearLabel: { fontSize: typography.fontSizes.lg, fontWeight: '800' },
  hijriLabel: { fontSize: typography.fontSizes.base, fontWeight: '600' },
  progressTxt: { fontSize: typography.fontSizes.xs },

  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    gap: spacing.md,
    borderBottomWidth: 1,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendLabel: { fontSize: typography.fontSizes.xs },
  legendCount: { marginLeft: 'auto', fontSize: typography.fontSizes.xs },

  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.sm },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontSize: typography.fontSizes.md, fontWeight: '700' },
  emptyText: { fontSize: typography.fontSizes.base },

  grid: { padding: spacing.base, paddingBottom: spacing['2xl'] },
  gridRow: { gap: CARD_GAP, marginBottom: CARD_GAP },

  dayCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.xs,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: 3,
    position: 'relative',
    minHeight: CARD_SIZE * 1.3,
    justifyContent: 'center',
  },
  moonBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moonEmoji: { fontSize: 12 },
  ramadanDay: { fontSize: 16, fontWeight: '800' },
  ramadanLabel: { fontSize: 9, fontWeight: '500', textTransform: 'uppercase' },
  dateLabel: { fontSize: 9, textAlign: 'center' },
  checkMark: { position: 'absolute', top: 4, right: 4 },

  // Sheet content
  sheetContent: { flex: 1, paddingBottom: 24 },
  sheetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    marginBottom: spacing.md,
  },
  sheetTitle: { fontSize: typography.fontSizes.md, fontWeight: '700' },
  sheetCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
    padding: spacing.md,
    marginHorizontal: spacing.base,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  sheetDayBadge: { alignItems: 'center', minWidth: 56 },
  sheetDayNum: { fontSize: 36, fontWeight: '800' },
  sheetDaySub: { fontSize: 11, fontWeight: '500', textTransform: 'uppercase' },
  sheetMeta: { flex: 1, gap: spacing.xs },
  sheetDate: { fontSize: typography.fontSizes.md, fontWeight: '700' },
  sheetHijri: { fontSize: typography.fontSizes.sm, fontWeight: '600' },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  statusText: { fontSize: typography.fontSizes.xs, fontWeight: '600' },

  niyatCard: {
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  niyatTitle: { fontSize: typography.fontSizes.sm, fontWeight: '700' },
  niyatText: { fontSize: typography.fontSizes.sm, lineHeight: 20 },

  completeBtn: {
    height: 52,
    borderRadius: radius.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.sm,
  },
  completeBtnText: { fontSize: typography.fontSizes.base, fontWeight: '700', color: '#000' },

  doneWrap: {
    height: 52,
    borderRadius: radius.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.sm,
  },
  doneLabel: { fontSize: typography.fontSizes.base, fontWeight: '700' },
})
