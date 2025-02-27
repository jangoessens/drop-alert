import cron from "node-cron";
import { sendNotification } from "./notificationService.js";
import { subHours } from 'date-fns';

let trackedETFs = [];

export function addETF(symbol, threshold, period, data = []) {
    const checkDate = new Date().toISOString().replace('T', ':').split('.')[0];

    const checkData = {
        date: checkDate,
        currentPrice: data['currentPrice'] ?? '',
        priceDiff: data['priceDiff'] ?? '',
        percentageDiff: data['percentageDiff'],
    }

    const existingIndex = trackedETFs.findIndex(etf => etf.symbol === symbol);
    if (existingIndex !== -1) {
        trackedETFs[existingIndex] = { symbol, threshold, period, checkData };
    } else {
        trackedETFs.push({ symbol, threshold, period, checkData });
    }
}

function updateETF(symbol, fetchData){
    const etfIndex = trackedETFs.findIndex(etf => etf.symbol === symbol);
    if (etfIndex !== -1) {
        const checkDate = new Date().toISOString().replace('T', ':').split('.')[0];
        const checkData = {
            date: checkDate,
            currentPrice: fetchData.currentPrice,
            historicalPrice: fetchData.historicalPrice,
            priceDiff: fetchData.priceDifference,
            percentageDiff: fetchData.percentageChange,
        };
        trackedETFs[etfIndex].checkData = checkData;
    }

}

export async function getSymbolByQuery(query) {
    if (!query) {
        return [];
    }

    const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${query}`;
    const response = await fetch(url);
    const data = await response.json();
    const results = data.quotes.map(quote => ({
        symbol: quote.symbol,
        name: quote.shortname,
        exchange: quote.exchDisp,
        iconUrl: quote.iconUrl,
    }));
    return results;
};

export function removeETF(symbol) {
    trackedETFs = trackedETFs.filter(etf => etf.symbol !== symbol);
}

export function getTrackedETFs() {
    return trackedETFs;
}

export async function manualUpdate() {
    await checkETFPrices();
    return trackedETFs;
}

async function checkETFPrices() {
    for (let etf of trackedETFs) {
        try {
            const response = await getStockPriceDifference(etf.symbol, 24)
            updateETF(etf.symbol, response);
            const percentageChange = response.percentageChange;

            if (percentageChange >= etf.threshold) {
                sendNotification(`ALERT: ${etf.symbol} dropped ${percentageChange}%!`);
                console.log("Notifcation Sent")
            }
            
        } catch (error) {
            console.error(`Error fetching ${etf.symbol} data:`, error);
        }
    }
}
// Function to fetch stock price difference over a given period (in hours)
async function getStockPriceDifference(symbol, period) {
    try {
      // Calculate the start time based on the period in hours
      const startDate = subHours(new Date(), parseInt(period)); // Subtract the given number of hours from the current date
  
      // Convert startDate to the required format (Unix timestamp in milliseconds)
      const startTimestamp = Math.floor(startDate.getTime() / 1000);
  
      // Yahoo Finance API endpoint for historical data
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${startTimestamp}&period2=${Math.floor(Date.now() / 1000)}&interval=1h`;
  
      // Fetch the historical data from Yahoo Finance API
      const response = await fetch(url);
      const data = await response.json();
  
      // Check if the response contains the necessary data
      if (!data || !data.chart || !data.chart.result) {
        throw new Error('No historical data found for the given period.');
      }
  
      // Get the historical prices
      const historicalPrices = data.chart.result[0].indicators.quote[0].close;
  
      if (historicalPrices.length === 0) {
        throw new Error('No historical data found for the given period.');
      }
  
      // Get the price from the earliest available data (period ago)
      const historicalPrice = historicalPrices[0];
  
      // Get the most recent price from the historical data
      const currentPrice = historicalPrices[historicalPrices.length - 1];
  
      // Calculate the absolute difference and percentage change
      const priceDifference = currentPrice - historicalPrice;
      const percentageChange = (priceDifference / historicalPrice) * 100;
  

      const returnObject = {
        currentPrice,
        historicalPrice,
        priceDifference: Math.abs(priceDifference), // Absolute difference
        percentageChange: percentageChange.toFixed(2), // Percentage difference
      }

      // Return the result as an object
      return returnObject;
    } catch (error) {
      console.error('Error fetching stock data:', error);
      return null; // Return null in case of error
    }
  }
  

export function startScheduler() {
    cron.schedule("*/5 * * * *", () => {
        console.log("Checking ETF prices...");
        checkETFPrices();
    });
}
