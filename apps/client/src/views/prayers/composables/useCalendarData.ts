import {useDeviceStore} from "@/stores/device.store"
export function useCalendarData() {
  const {isMobile} = useDeviceStore()
  const uzbekLocale = {
  lang: {
    locale: 'uz',
    placeholder: 'Sanani tanlang',
    rangePlaceholder: ['Boshlanish', 'Tugash'],
    today: 'Bugun',
    now: 'Hozir',
    backToToday: 'Bugunga qaytish',
    ok: 'OK',
    clear: 'Tozalash',
    month: 'Oy',
    year: 'Yil',
    timeSelect: 'Vaqtni tanlash',
    dateSelect: 'Sanani tanlash',
    monthSelect: 'Oyni tanlang',
    yearSelect: 'Yilni tanlang',
    decadeSelect: "O'n yillikni tanlang",
    yearFormat: 'YYYY',
    dateFormat: 'DD.MM.YYYY',
    dayFormat: 'D',
    dateTimeFormat: 'DD.MM.YYYY HH:mm:ss',
    monthFormat: 'MMMM',
    monthBeforeYear: true,
    previousMonth: 'Oldingi oy (PageUp)',
    nextMonth: 'Keyingi oy (PageDown)',
    previousYear: 'Oldingi yil (Control + left)',
    nextYear: 'Keyingi yil (Control + right)',
    previousDecade: "Oldingi o'n yillik",
    nextDecade: "Keyingi o'n yillik",
    previousCentury: 'Oldingi asr',
    nextCentury: 'Keyingi asr',
    shortWeekDays: isMobile ? ['Ya', 'Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha'] : [
      'Yakshanba',
      'Dushanba',
      'Seshanba',
      'Chorshanba',
      'Payshanba',
      'Juma',
      'Shanba',
    ],
    shortMonths: [
      'Yanvar',
      'Fevral',
      'Mart',
      'Aprel',
      'May',
      'Iyun',
      'Iyul',
      'Avgust',
      'Sentabr',
      'Oktabr',
      'Noyabr',
      'Dekabr',
    ],
  },
  timePickerLocale: {
    placeholder: 'Vaqtni tanlang',
  },
  dateFormat: 'DD.MM.YYYY',
  dateTimeFormat: 'DD.MM.YYYY HH:mm:ss',
  weekFormat: 'YYYY-wo',
  monthFormat: 'YYYY-MM',
}

return {
  uzbekLocale
}
}
