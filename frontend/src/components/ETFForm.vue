<script setup>
import { ref } from 'vue';
import axios from 'axios';

const etfSymbol = ref('');
const threshold = ref(1.5);
const period = ref(1);

const trackETF = async () => {
    await axios.post("http://localhost:5000/api/etf/track", {
        etfSymbol: etfSymbol.value,
        threshold: threshold.value,
        period: period.value
    });
    alert("ETF tracking ingesteld!");
};
</script>

<template>
  <div>
    <input v-model="etfSymbol" placeholder="ETF Symbool (bijv. VOO)" />
    <input v-model="threshold" type="number" placeholder="Drempel (%)" />
    <button @click="trackETF">Track ETF</button>
  </div>
</template>
