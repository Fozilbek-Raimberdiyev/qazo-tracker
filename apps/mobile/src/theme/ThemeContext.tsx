import React, { createContext, useContext, useState, useEffect } from 'react'
import { useColorScheme } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { darkTheme, lightTheme, type Theme } from './index'

type ThemeContextType = {
  theme: Theme
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: darkTheme,
  isDark: true,
  toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme()
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    SecureStore.getItemAsync('theme_preference').then((pref) => {
      if (pref !== null) {
        setIsDark(pref === 'dark')
      } else {
        setIsDark(systemScheme !== 'light')
      }
    })
  }, [systemScheme])

  const toggleTheme = async () => {
    const next = !isDark
    setIsDark(next)
    await SecureStore.setItemAsync('theme_preference', next ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme: isDark ? darkTheme : lightTheme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
