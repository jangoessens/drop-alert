<script setup>
import ETFForm from './components/ETFForm.vue';
import ETFList from './components/ETFList.vue';
import NotificationButton from './components/NotificationButton.vue';
</script>

<template>
  <div class="container">
    <h1>ETF Price Alert</h1>
    <NotificationButton />
    <ETFForm />
    <hr>
    <ETFList />
  </div>
</template>

<style scoped>
.container { text-align: center; padding: 20px; }
</style>
