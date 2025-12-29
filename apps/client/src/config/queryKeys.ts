export const queryKeys = {
  auth: {
    register: 'auth.register',
    login: 'auth.login',
    google: 'auth.google',
  },
  user: {
    me: 'user.me',
  },
  prayer: {
    generate: 'prayer.generate',
    list: 'prayer.list',
    singleComplete: 'prayer.complete',
    downloadAsPdf: 'prayer.pdf',
    completeMultiple : "prayer.complete.multiple",
    uncompleteMultiple : "prayer.uncomplete.multiple"
  },
  fasting: {
    generate: 'fasting.generate',
    list: 'fasting.list',
    singleComplete: 'fasting.complete',
  },
  dashboard : {
    prayersCount : 'dashboard.prayersCount',
    prayerCountPerYear : 'dashboard.prayerCountPerYear',
    prayersCountByPrayerTypes : 'dashboard.prayersCountByPrayerTypes',
    last24MonthCompletedCount : 'dashboard.last24MonthCompletedCount',
    fastingCount : 'dashboard.fastingCount',
    fastingCountPerYear : "dashboard.fastingCountPerYear",
    completedCountFastingByYear : "dashboard.completedCountFastingByYear"
  }
}
