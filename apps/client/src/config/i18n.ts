import { createI18n } from 'vue-i18n'




const i18n = createI18n({
  legacy: false,
  locale : "uz",
  fallbackLocale: "uz",
  messages : {},
    missing: (locale, key) => {
      return key
    },
})

export default i18n

