import { Injectable } from '@angular/core';



interface MarketChart {
  prices: Array<Array<number>>
  total_volumes: Array<Array<number>>
  market_caps: Array<Array<number>>
}

@Injectable({
  providedIn: 'root'
})

export class AnalyticsService {

  json: MarketChart;
  longestDecrease: String = "";
  highestVolumeData: Array<String> = ["",""];
  profitDates: Array<String> = ["",""];
  prices: Array<Array<number>>;
  total_volumes: Array<Array<number>>;

  constructor() { }

  //simple method that retuns given array of dates as unix timestamps
  datesToUnix(dates: Array<Date>) {
    let datesUnix = [];
    for (var date of dates) {
      datesUnix.push(date.getTime() / 1000);
    }
    datesUnix[1] += 10800;
    return datesUnix
  }
 
  //fetch the json from api for given dates
  getJson = async (datesUnix: Array<number>) => {
    let url: string = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur&from=${datesUnix[0]}&to=${datesUnix[1]}`;
    return await window.fetch(url)
  }

  //method that returns the length of the longest bearish streak of the given dates
  longestBearish(prices: Array<Array<number>>) {
    let decrease: number = 0;
    let current: number = 0;
    for (let i = 1; i < prices.length; i++) {
      if (prices[i][1] < prices[i - 1][1]) {
        current += 1;
        if (current > decrease) {
          decrease = current;
        }
      }
      else {
        current = 0;
      }
    }
    return decrease.toString();
  }

  //method that returns highest volume and date of given dates as string.
  highestVolume(volumes: Array<Array<number>>) {
    let highVolumeTime: number = 0;
    let highestVolumeNumber: number = 0;
    highestVolumeNumber = Math.max.apply(Math, volumes.map(function (o) { return o[1]; }))
    var arr = volumes.find(function (o) { return o[1] == highestVolumeNumber; })
    if (arr) {
      highVolumeTime = arr[0]
    }
    let highVolumeDate = new Date(highVolumeTime)
    return [highestVolumeNumber.toFixed(2).toString(), `${highVolumeDate.getFullYear()}-${highVolumeDate.getMonth() + 1}-${highVolumeDate.getDate()}`];
  }

  //method that calculates and returns day range for best profit days, returns array with empty strings if there are no days to profit from.
  maximumProfit(prices: Array<Array<number>>) {
    let lowestTime: number = prices[0][0];
    let lowestPrice: number = prices[0][1];
    let differenceStartTime: number = 0
    let differenceEndTime: number = 0;
    let differenceAmount: number = 0;
    for (let i = 1; i < prices.length; i++) {
      if (prices[i][1] - lowestPrice > differenceAmount) {
        differenceAmount = prices[i][1] - lowestPrice;
        differenceStartTime = lowestTime;
        differenceEndTime = prices[i][0];
      }
      if (prices[i][1] < lowestPrice) {
        lowestPrice = prices[i][1];
        lowestTime = prices[i][0];
      }
    }
    //catching if profit cannot be made, returning array with empty strings
    if (differenceStartTime == differenceEndTime) {
      return ["",""]
    }
    else {
      let diffStartDate = new Date(differenceStartTime)
      let diffEndDate = new Date(differenceEndTime)
      return [`${diffStartDate.getFullYear()}-${diffStartDate.getMonth() + 1}-${diffStartDate.getDate()}`, `${diffEndDate.getFullYear()}-${diffEndDate.getMonth() + 1}-${diffEndDate.getDate()}`];
    }
  }

  //method calls other methods of this service to find requested info from the dates. Returns array of strings of the requested info.
  analyzeDates = async (dates: Array<Date>) => {

    let datesUnix: Array<number> = this.datesToUnix(dates);

    await this.getJson(datesUnix)
      .then(response => response.json())
      .then(data => this.json = data)
      .catch((error) => {
        console.error('Error:', error)
      });
      
    //api gives results for every hour when query is shorter than 90 days, picking data for once per day
    if (this.json) {
      if (datesUnix[1] - datesUnix[0] < 7776000) {
        this.prices = Array(this.json.prices[0])
        this.total_volumes = Array(this.json.total_volumes[0])
        for (let i = 24; i < this.json.prices.length; i += 24) {
          this.prices.push(this.json.prices[i])
          this.total_volumes.push(this.json.total_volumes[i])
        }
      }
      //if time was longer than 90 days, uses data that was fetched without modifying it
      else {
        this.prices = this.json.prices;
        this.total_volumes = this.json.total_volumes;
      }
      this.longestDecrease = this.longestBearish(this.prices);
      this.highestVolumeData = this.highestVolume(this.total_volumes);
      this.profitDates = this.maximumProfit(this.prices);
    }
    //no json found, so there was something wrong in fetching. Sets first string in return to show there was an error.
    else {
      this.longestDecrease = "data not found"
    }
    return [this.longestDecrease, this.highestVolumeData[0], this.highestVolumeData[1], this.profitDates[0], this.profitDates[1]];

  }
}