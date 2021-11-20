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
  longestDecrease: String;
  highestVolumeString: String;
  highestVolumeTime: String;
  profitDateStart: String;
  profitDateEnd: String;

  constructor() { }

  datesToUnix(dates: Array<Date>) {
    let datesUnix = [];
    for (var date of dates) {
      datesUnix.push(date.getTime() / 1000 + 7200);
    }
    return datesUnix
  }

  getJson = async (datesUnix: Array<number>) => {
    let url: string = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur&from=${datesUnix[0]}&to=${datesUnix[1]}`;
    return await window.fetch(url)
  }

  longestBearish(prices: Array<Array<number>>) {
    var decrease = 0;
    var current = 0;
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
    this.longestDecrease = decrease.toString();
  }

  highestVolume(volumes: Array<Array<number>>) {
    let highVolumeTime: number = 0;
    let highestVolumeNumber : number = 0;
    for (let i = 0; i < volumes.length; i++) {
      if (volumes[i][1] > highestVolumeNumber) {
        highestVolumeNumber = volumes[i][1];
        highVolumeTime = volumes[i][0];
      }
    }
    this.highestVolumeString = highestVolumeNumber.toString();
    let highVolumeDate = new Date(highVolumeTime)
    this.highestVolumeTime = `${highVolumeDate.getFullYear()}-${highVolumeDate.getMonth() + 1}-${highVolumeDate.getDate()}`;
  }

  maximumProfit(prices: Array<Array<number>>) {
    var lowestTime = prices[0][0];
    var lowestPrice = prices[0][1];
    var differenceStartTime = 0
    var differenceEndTime = 0;
    var differenceAmount = 0;
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
    if (differenceStartTime == differenceEndTime) {
      return;
    }
    let diffStartDate = new Date(differenceStartTime)
    let diffEndDate = new Date(differenceEndTime)
    this.profitDateStart = `${diffStartDate.getFullYear()}-${diffStartDate.getMonth() + 1}-${diffStartDate.getDate()}`;
    this.profitDateEnd = `${diffEndDate.getFullYear()}-${diffEndDate.getMonth() + 1}-${diffEndDate.getDate()}`;
  }

  analyzeDates = async (dates: Array<Date>) => {
    let datesUnix: Array<number> = this.datesToUnix(dates);
    await this.getJson(datesUnix)
      .then(response => response.json())
      .then(data => this.json = data);
    this.longestBearish(this.json.prices);
    this.highestVolume(this.json.total_volumes);
    this.maximumProfit(this.json.prices);
    return [this.longestDecrease, this.highestVolumeString, this.highestVolumeTime, this.profitDateStart, this.profitDateEnd];
  }
}

