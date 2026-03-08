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

export default function LoginScreen() {
  const { theme } = useTheme()
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParams>>()
  const { setToken } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Xato', 'Email va parolni kiriting')
      return
    }
    setLoading(true)
    try {
      const res = await authApi.login({ email: email.trim(), password })
      await setToken(res.accessToken)
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Email yoki parol noto\'g\'ri'
      Alert.alert('Kirish muvaffaqiyatsiz', typeof msg === 'string' ? msg : msg[0])
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
          {/* Logo & Heading */}
          <View style={styles.header}>
            <View style={[styles.logoRing, { borderColor: c.primaryBorder, backgroundColor: c.primaryDim }]}>
              <Text style={styles.logoEmoji}>☪️</Text>
            </View>
            <Text style={[styles.title, { color: c.text }]}>Qazo Tracker</Text>
            <Text style={[styles.subtitle, { color: c.textSecondary }]}>
              Hisobingizga kiring
            </Text>
          </View>

          {/* Form Card */}
          <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
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
                  returnKeyType="next"
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
                  placeholder="••••••••"
                  placeholderTextColor={c.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
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

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: c.primary }, loading && styles.btnDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.btnText}>Kirish</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Register Link */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: c.textSecondary }]}>
              Hisobingiz yo'qmi?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={[styles.footerLink, { color: c.primary }]}>Ro'yxatdan o'ting</Text>
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
    paddingVertical: spacing['3xl'],
  },
  header: { alignItems: 'center', marginBottom: spacing['2xl'] },
  logoRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoEmoji: { fontSize: 36 },
  title: { fontSize: typography.fontSizes['2xl'], fontWeight: '800', letterSpacing: 0.5 },
  subtitle: { fontSize: typography.fontSizes.base, marginTop: 4 },
  card: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.xl,
    gap: spacing.md,
  },
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
