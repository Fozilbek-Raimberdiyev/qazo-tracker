// stores/theme.js
import { defineStore } from 'pinia'
import { theme } from 'ant-design-vue'
const style =  window.getComputedStyle(document.body);
const primaryColor  = style.getPropertyValue('--color-primary');
const colorBackgroundDark = style.getPropertyValue('--color-background-dark');
const fontDisplay = style.getPropertyValue('--font-display');
const colorBackgroundLight = style.getPropertyValue('--color-background-light');
const colorBgContainerLightAntd = style.getPropertyValue('--color-bg-container-light-antd');
const colorBgContainerDarkAntd = style.getPropertyValue('--color-bg-container-dark-antd');
export const useThemeStore = defineStore('theme', {
  state: () => ({
    primaryColor,
    colorBackgroundDark,
    fontDisplay,
    colorBackgroundLight,
    isDark: false,
  }),

  getters: {
    themeConfig: (state) => ({
      componentSize : 'large',
      wave : {disabled : false},
      algorithm: state.isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      token: {
        colorPrimary: state.primaryColor,
        colorBgContainer: state.isDark ? colorBgContainerDarkAntd : colorBgContainerLightAntd,
        fontFamily: state.fontDisplay,
        borderRadius : 8

      },
    } ),
  },

  actions: {
    toggleTheme() {
      this.isDark = !this.isDark
      const html = document.documentElement
      if (this.isDark) {
        html.classList.add('dark')
      } else {
        html.classList.remove('dark')
      }
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
    },
    initTheme() {
      const saved = localStorage.getItem('theme')
      this.isDark = saved === 'dark'

      const html = document.documentElement
      if (this.isDark) {
        html.classList.add('dark')
      } else {
        html.classList.remove('dark')
      }
    },
  },
})
