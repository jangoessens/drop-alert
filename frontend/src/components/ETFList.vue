<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import currencyFormatter from 'currency-formatter';

const tracked = ref([]);

const trackETF = async () => {
    axios.get("http://localhost:5000/api/etf/tracked").then((res) => {
        tracked.value = res.data;
    }).catch((err) => {
        alert("Something went wrong");
    });

};

const removeETF = async (etfSymbol) => {
    axios.post("http://localhost:5000/api/etf/remove",  {
        etfSymbol: etfSymbol,
    });

};


const manualUpdate = async () => {
    axios.get("http://localhost:5000/api/etf/update").then((res) => {
        tracked.value = res.data;
    })
}

onMounted(() => {
    trackETF();
});

const refresh = () => {
    trackETF();
}
</script>

<template>
  <div>
   
        <table>
            <thead>
                <tr>
                    <th>Symbol</th>
                    <th>Summary</th>
                    <th>Huidige prijs</th>
                    <th>Difference</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="etf in tracked" :key="etf.symbol">
                    <td>{{ etf.symbol }}</td>
                    <td>Geef bericht als ETF binnen 24 uur meer dan {{ etf.threshold }} % zakt</td>
                    <td>{{ currencyFormatter.format(etf.checkData.currentPrice, {locale: 'nl-NL'}) }}</td>
                    <td>Afgelopen 24 uur: <span>{{ etf.checkData.percentageDiff }}%</span></td>
                    <td>
                        <button @click="removeETF(etf.symbol)">Remove</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <button @click="refresh">
            <i class="fas fa-sync-alt"></i> Refresh
        </button>

        <button @click="manualUpdate">
            Manual Update
        </button>
  </div>
</template>

<style>
    table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        font-size: 1em;
        min-width: 400px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    }

    thead tr {
        background-color: #009879;
        color: #ffffff;
        text-align: left;
        font-weight: bold;
    }

    th, td {
        padding: 12px 15px;
        border: 1px solid #dddddd;
    }

    tbody tr {
        border-bottom: 1px solid #dddddd;
    }

    tbody tr:nth-of-type(even) {
        background-color: #f3f3f3;
    }

    tbody tr:last-of-type {
        border-bottom: 2px solid #009879;
    }

    tbody tr:hover {
        background-color: #f1f1f1;
    }

    button {
        background-color: #009879;
        color: white;
        border: none;
        padding: 10px 20px;
        cursor: pointer;
        font-size: 1em;
        border-radius: 5px;
    }

    button:hover {
        background-color: #007f63;
    }

    button i {
        margin-right: 5px;
    }
</style>