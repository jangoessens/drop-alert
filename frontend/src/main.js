import "./style.scss";
import { createApp } from "vue";
import App from "./App.vue";
import OneSignalVue from "@onesignal/onesignal-vue3";

const app = createApp(App);

app.use(OneSignalVue, {
  appId: "5a788e64-4d00-4f32-bcb0-67162f181edc", // Replace with your OneSignal App ID
  autoRegister: true,
  path: "/drop-alert/", // Path to the root of your app on GitHub Pages
  serviceWorkerPath: "/drop-alert/OneSignalSDKWorker.js", // Ensure this points to the correct location
});

app.mount("#app");
