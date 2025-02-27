<script setup>
import { ref } from 'vue';
import axios from 'axios';
import Autocomplete from 'vue3-autocomplete'
import 'vue3-autocomplete/dist/vue3-autocomplete.css'

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


const onSelect = (item) => {
  etfSymbol.value = item.symbol;
  if(autoComplete.value) {
    autoComplete.value.setText(`${item.name} - ${item.symbol}`);
  }
};

const getItems = async (query) => {
  console.log(query);
  const response = await axios.get(`http://localhost:5000/api/etf/search?query=${query}`);
  items.value = response.data;
};


const items = ref([]);

const autoComplete = ref(null);


</script>

<template>
  <div class="tracker-input">
    <Autocomplete @onSelect="onSelect" @input="getItems" :results="items"
      :displayItem="item => `${item.name} - ${item.symbol}`"
      :debounce="50" ref="autoComplete"></Autocomplete>

    <input v-model="etfSymbol" hidden placeholder="ETF Symbool (bijv. VOO)" />
    <input v-model="threshold" type="number" placeholder="Drempel (%)" step="0.25"/>
    <button @click="trackETF">Track ETF</button>
  </div>
</template>

<style lang="scss" scoped>
.tracker-input {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 16px;
}


button:hover {
  background-color: #0056b3;
}
</style>
