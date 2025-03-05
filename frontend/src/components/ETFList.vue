<script setup>
import { onMounted, ref } from 'vue';
import currencyFormatter from 'currency-formatter';
import { axiosInstance } from '../helpers/api';
const baseURL = import.meta.env.VITE_NGROK_URL;
const tracked = ref([]);
const trackETF = async () => {
    axiosInstance.get(`${baseURL}/api/etf/tracked`).then((res) => {
        tracked.value = res.data;
    }).catch((err) => {
        alert("Something went wrong");
    });
};

const removeETF = async (etfSymbol) => {
    axiosInstance.post(`${baseURL}/api/etf/remove`, {
        etfSymbol: etfSymbol,
    });
};

const manualUpdate = async () => {
    axiosInstance.get(`${baseURL}/api/etf/update`).then((res) => {
        tracked.value = res.data;
    });
};

onMounted(() => {
    trackETF();
});

const refresh = () => {
    trackETF();
};
</script>

<template>
    <div>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Huidige prijs</th>
                        <th>Difference</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="etf in tracked" :key="etf.symbol">
                        <td>{{ etf.symbol }}</td>
                        <td>{{ currencyFormatter.format(etf.checkData.currentPrice, { locale: 'nl-NL' }) }}</td>
                        <td><span>{{ etf.checkData.percentageDiff }}%</span></td>
                        <td>
                            <button class="invisible" @click="removeETF(etf.symbol)">
                                🗑️
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="buttons">
            <button @click="refresh">
                <i class="fas fa-sync-alt"></i> Refresh
            </button>

            <button @click="manualUpdate">
                Manual Update
            </button>
        </div>
    </div>
</template>

<style>
.table-container {
    max-width: 100%;
    overflow-x: auto;
}

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

th,
td {
    padding: 8px 10px;
    border: 1px solid #dddddd;

    @media (min-width: 768px) {
        padding: 12px 15px;
    }
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

button.danger {
    background-color: lightcoral;

}

button.invisible {
    background-color: transparent;
    color: #009879;
    border: none;
    padding: 0;
    cursor: pointer;
}

button:hover {
    background-color: #007f63;
}

button i {
    margin-right: 5px;
}

.buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-top: 20px;
    gap: 24px;
}
</style>
