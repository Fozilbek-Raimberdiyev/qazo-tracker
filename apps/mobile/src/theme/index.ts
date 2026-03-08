export const palette = {
  primary: '#216974',
  primaryDim: 'rgba(33, 105, 116, 0.15)',
  primaryBorder: 'rgba(33, 105, 116, 0.3)',

  // Backgrounds
  bgDark: '#0a0a0a',
  surfaceDark: '#141414',
  cardDark: '#1c1c1c',
  borderDark: '#2a2a2a',
  inputDark: '#1e1e1e',

  bgLight: '#f5f5f5',
  surfaceLight: '#ffffff',
  cardLight: '#ffffff',
  borderLight: '#e5e7eb',
  inputLight: '#f9fafb',

  // Text
  textPrimary: '#f9fafb',
  textSecondary: '#9ca3af',
  textMuted: '#6b7280',
  textDark: '#111827',
  textDarkSecondary: '#4b5563',

  // Status
  success: '#13ec5b',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',

  // Prayer colors
  bomdod: '#818cf8',
  peshin: '#fb923c',
  asr: '#facc15',
  shom: '#f472b6',
  xufton: '#60a5fa',
  vitr: '#a78bfa',
}

export type Theme = {
  dark: boolean
  colors: {
    background: string
    surface: string
    card: string
    border: string
    input: string
    text: string
    textSecondary: string
    textMuted: string
    primary: string
    primaryDim: string
    primaryBorder: string
    error: string
    success: string
    warning: string
  }
}

export const darkTheme: Theme = {
  dark: true,
  colors: {
    background: palette.bgDark,
    surface: palette.surfaceDark,
    card: palette.cardDark,
    border: palette.borderDark,
    input: palette.inputDark,
    text: palette.textPrimary,
    textSecondary: palette.textSecondary,
    textMuted: palette.textMuted,
    primary: palette.primary,
    primaryDim: palette.primaryDim,
    primaryBorder: palette.primaryBorder,
    error: palette.error,
    success: palette.success,
    warning: palette.warning,
  },
}

export const lightTheme: Theme = {
  dark: false,
  colors: {
    background: palette.bgLight,
    surface: palette.surfaceLight,
    card: palette.cardLight,
    border: palette.borderLight,
    input: palette.inputLight,
    text: palette.textDark,
    textSecondary: palette.textDarkSecondary,
    textMuted: '#9ca3af',
    primary: '#216974',
    primaryDim: 'rgba(33, 105, 116, 0.1)',
    primaryBorder: 'rgba(33, 105, 116, 0.25)',
    error: palette.error,
    success: palette.success,
    warning: palette.warning,
  },
}

export const typography = {
  fontSizes: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    '2xl': 30,
    '3xl': 36,
  },
  fontWeights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
}

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
}

export const prayerColors: Record<string, string> = {
  bomdod: palette.bomdod,
  peshin: palette.peshin,
  asr: palette.asr,
  shom: palette.shom,
  xufton: palette.xufton,
  vitr: palette.vitr,
  default: palette.primary,
}
