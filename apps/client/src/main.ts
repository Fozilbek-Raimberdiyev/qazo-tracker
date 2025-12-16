import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import "@/assets/css/style.css"
import 'ant-design-vue/dist/reset.css';
import App from './App.vue'
import router from './router'
import i18n from './config/i18n';

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(VueQueryPlugin)
app.mount('#app')
