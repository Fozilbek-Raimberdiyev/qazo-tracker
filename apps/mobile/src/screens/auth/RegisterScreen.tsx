import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useTheme } from '../../theme/ThemeContext'
import { spacing, radius, typography } from '../../theme'
import { authApi } from '../../api/auth.api'
import { useAuthStore } from '../../store/auth.store'
import type { AuthStackParams } from '../../navigation'

export default function RegisterScreen() {
  const { theme } = useTheme()
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParams>>()
  const { setToken } = useAuthStore()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Xato', 'Email va parolni kiriting')
      return
    }
    if (password.length < 8) {
      Alert.alert('Xato', 'Parol kamida 8 ta belgi bo\'lishi kerak')
      return
    }
    setLoading(true)
    try {
      const res = await authApi.register({
        email: email.trim(),
        password,
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
      })
      await setToken(res.accessToken)
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Ro\'yxatdan o\'tish xatosi'
      Alert.alert('Xato', typeof msg === 'string' ? msg : msg[0])
    } finally {
      setLoading(false)
    }
  }

  const c = theme.colors

  return (
    <LinearGradient
      colors={theme.dark ? ['#0a0a0a', '#0d1a0f'] : ['#f0fff4', '#f5f5f5']}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color={c.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: c.text }]}>Ro'yxatdan o'tish</Text>
            <Text style={[styles.subtitle, { color: c.textSecondary }]}>
              Yangi hisob yarating
            </Text>
          </View>

          {/* Form Card */}
          <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
            {/* Name row */}
            <View style={styles.row}>
              <View style={[styles.field, styles.flex]}>
                <Text style={[styles.label, { color: c.textSecondary }]}>Ism</Text>
                <View style={[styles.inputWrap, { backgroundColor: c.input, borderColor: c.border }]}>
                  <TextInput
                    style={[styles.input, { color: c.text }]}
                    placeholder="Ism"
                    placeholderTextColor={c.textMuted}
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                </View>
              </View>
              <View style={[styles.field, styles.flex]}>
                <Text style={[styles.label, { color: c.textSecondary }]}>Familiya</Text>
                <View style={[styles.inputWrap, { backgroundColor: c.input, borderColor: c.border }]}>
                  <TextInput
                    style={[styles.input, { color: c.text }]}
                    placeholder="Familiya"
                    placeholderTextColor={c.textMuted}
                    value={lastName}
                    onChangeText={setLastName}
                  />
                </View>
              </View>
            </View>

            {/* Email */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: c.textSecondary }]}>Email</Text>
              <View style={[styles.inputWrap, { backgroundColor: c.input, borderColor: c.border }]}>
                <Ionicons name="mail-outline" size={18} color={c.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: c.text }]}
                  placeholder="email@example.com"
                  placeholderTextColor={c.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: c.textSecondary }]}>Parol</Text>
              <View style={[styles.inputWrap, { backgroundColor: c.input, borderColor: c.border }]}>
                <Ionicons name="lock-closed-outline" size={18} color={c.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: c.text }]}
                  placeholder="Kamida 8 ta belgi"
                  placeholderTextColor={c.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  returnKeyType="done"
                  onSubmitEditing={handleRegister}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color={c.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: c.primary }, loading && styles.btnDisabled]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.btnText}>Ro'yxatdan o'tish</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: c.textSecondary }]}>Hisobingiz bormi? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.footerLink, { color: c.primary }]}>Kirish</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.base,
    paddingVertical: spacing['2xl'],
  },
  header: { marginBottom: spacing['2xl'] },
  backBtn: { marginBottom: spacing.base, alignSelf: 'flex-start', padding: 4 },
  title: { fontSize: typography.fontSizes['2xl'], fontWeight: '800' },
  subtitle: { fontSize: typography.fontSizes.base, marginTop: 4 },
  card: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.xl,
    gap: spacing.md,
  },
  row: { flexDirection: 'row', gap: spacing.sm },
  field: { gap: spacing.xs },
  label: { fontSize: typography.fontSizes.sm, fontWeight: '500' },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    height: 50,
  },
  inputIcon: { marginRight: spacing.sm },
  input: { flex: 1, fontSize: typography.fontSizes.base },
  eyeBtn: { padding: 4 },
  btn: {
    height: 52,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontSize: typography.fontSizes.base, fontWeight: '700', color: '#000' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  footerText: { fontSize: typography.fontSizes.base },
  footerLink: { fontSize: typography.fontSizes.base, fontWeight: '600' },
})
