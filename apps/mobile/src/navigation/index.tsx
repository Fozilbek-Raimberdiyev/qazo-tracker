import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '../store/auth.store'
import { useTheme } from '../theme/ThemeContext'

import LoginScreen from '../screens/auth/LoginScreen'
import RegisterScreen from '../screens/auth/RegisterScreen'
import DashboardScreen from '../screens/dashboard/DashboardScreen'
import PrayersScreen from '../screens/prayers/PrayersScreen'
import FastingScreen from '../screens/fasting/FastingScreen'
import SettingsScreen from '../screens/settings/SettingsScreen'

export type AuthStackParams = {
  Login: undefined
  Register: undefined
}

export type TabParams = {
  Dashboard: undefined
  Prayers: undefined
  Fasting: undefined
  Settings: undefined
}

const AuthStack = createNativeStackNavigator<AuthStackParams>()
const Tab = createBottomTabNavigator<TabParams>()

const TAB_ICONS: Record<string, [keyof typeof Ionicons.glyphMap, keyof typeof Ionicons.glyphMap]> = {
  Dashboard: ['grid', 'grid-outline'],
  Prayers: ['sunny', 'sunny-outline'],
  Fasting: ['moon', 'moon-outline'],
  Settings: ['settings', 'settings-outline'],
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{ headerShown: false, animation: 'fade_from_bottom' }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  )
}

function MainTabNavigator() {
  const { theme } = useTheme()
  const c = theme.colors

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        animation: 'shift',
        tabBarStyle: {
          backgroundColor: c.surface,
          borderTopWidth: 1,
          borderTopColor: c.border,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingHorizontal: 4,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: c.primary,
        tabBarInactiveTintColor: c.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarItemStyle: { borderRadius: 10, marginHorizontal: 2, paddingTop: 8 },
        tabBarActiveBackgroundColor: theme.dark
          ? 'rgba(33,105,116,0.15)'
          : 'rgba(33,105,116,0.1)',
        tabBarIcon: ({ focused, color }) => {
          const [active, inactive] = TAB_ICONS[route.name] ?? ['ellipse', 'ellipse-outline']
          return <Ionicons name={focused ? active : inactive} size={22} color={color} />
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Bosh sahifa' }} />
      <Tab.Screen name="Prayers" component={PrayersScreen} options={{ title: 'Namozlar' }} />
      <Tab.Screen name="Fasting" component={FastingScreen} options={{ title: "Ro'zalar" }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Sozlamalar' }} />
    </Tab.Navigator>
  )
}

export default function AppNavigator() {
  const { isLoading, isAuthenticated, loadToken } = useAuthStore()
  const { theme } = useTheme()
  const c = theme.colors

  useEffect(() => {
    loadToken()
  }, [])

  if (isLoading) {
    return (
      <View style={[styles.loader, { backgroundColor: c.background }]}>
        <ActivityIndicator size="large" color={c.primary} />
      </View>
    )
  }

  return (
    <NavigationContainer
      theme={{
        dark: theme.dark,
        colors: {
          primary: c.primary,
          background: c.background,
          card: c.surface,
          text: c.text,
          border: c.border,
          notification: c.primary,
        },
        fonts: {
          regular: { fontFamily: 'System', fontWeight: '400' },
          medium: { fontFamily: 'System', fontWeight: '500' },
          bold: { fontFamily: 'System', fontWeight: '700' },
          heavy: { fontFamily: 'System', fontWeight: '900' },
        },
      }}
    >
      {isAuthenticated ? <MainTabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})
