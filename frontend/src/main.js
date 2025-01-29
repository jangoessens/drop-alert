import './style.scss';
import { createApp } from 'vue';
import App from './App.vue';
import OneSignalVue from '@onesignal/onesignal-vue3';

const app = createApp(App);

app.use(OneSignalVue, {
  appId: "5a788e64-4d00-4f32-bcb0-67162f181edc", // Replace with your OneSignal App ID
  allowLocalhostAsSecureOrigin: true, // Enable notifications in local dev
});

app.mount('#app');
