import { Injectable } from '@angular/core';
import { DatesToUnixService } from './dates-to-unix.service';
import { FetchDataService } from './fetch-data.service';



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
  longestDecrease: string = "";
  highestVolumeData: Array<string> = ["", ""];
  profitDates: Array<string> = ["", ""];
  prices: Array<Array<number>>;
  total_volumes: Array<Array<number>>;
  threeMonthsUnix: number = 7776000;
  apiChangeUnix: number = 1527187420;


  constructor(private dataFetcher: FetchDataService,
    private dateService: DatesToUnixService) { }



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
      return ["", ""]
    }
    else {
      let diffStartDate = new Date(differenceStartTime)
      let diffEndDate = new Date(differenceEndTime)
      return [`${diffStartDate.getFullYear()}-${diffStartDate.getMonth() + 1}-${diffStartDate.getDate()}`, `${diffEndDate.getFullYear()}-${diffEndDate.getMonth() + 1}-${diffEndDate.getDate()}`];
    }
  }

  //method calls other methods of this service to find requested info from the dates. Returns array of strings of the requested info.
  analyzeDates = async (dates: Array<Date>) => {

    let datesUnix: Array<number> = this.dateService.datesToUnix(dates);
    let dataMap = new Map<string, string>();

    await this.dataFetcher.getJson(datesUnix)
      .then(response => response.json())
      .then(data => this.json = data)
      .catch((error) => {
        console.error('Error:', error)
      });

    //api gives results for every hour when query is shorter than 90 days and starting later than 2018-5-24, picking data for once per day
    if (this.json) {
      if (datesUnix[1] - datesUnix[0] < this.threeMonthsUnix && datesUnix[0] > this.apiChangeUnix) {
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
      dataMap.set("longestDecrease", this.longestBearish(this.prices));
      this.highestVolumeData = this.highestVolume(this.total_volumes);
      this.profitDates = this.maximumProfit(this.prices);
      dataMap.set("highestVolume", this.highestVolumeData[0])
      dataMap.set("highestVolumeTime", this.highestVolumeData[1])
      dataMap.set("highestProfitStart", this.profitDates[0])
      dataMap.set("highestProfitEnd", this.profitDates[1])
    }
    //no json found, so there was something wrong in fetching. Sets first string in return to show there was an error.
    else {
      dataMap.set("longestDecrease", "data not found")
    }
    return dataMap;

  }
}