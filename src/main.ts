import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

// Bootstrap the Vue application and attach the router before mounting to #app
createApp(App).use(router).mount('#app')
