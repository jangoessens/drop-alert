<script setup>
import { useOneSignal } from "@onesignal/onesignal-vue3";

// Destructure the necessary methods from the OneSignal object
const { Slidedown } = useOneSignal();

const enableNotifications = async () => {
  try {
    // Trigger the push notification prompt
    await Slidedown.promptPush();
    console.log("Enabled notifs");
  } catch (error) {
    console.error("Error enabling notifications:", error);
  }
};
</script>

<template>
  <button @click="enableNotifications">
    Enable Push Notifications
  </button>
</template>
