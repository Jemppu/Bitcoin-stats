import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor() { }

  datesToUnix(dates = [new Date]){
    let datesUnix = [];
    for (var date of dates){
      datesUnix.push(date.getTime()/1000 + 7200);
    }
    return datesUnix
  }

  getJson(url = 'string'){
    var Httpreq = new XMLHttpRequest();
    Httpreq.open("GET",url,false);
    Httpreq.send(null);
    var json = JSON.parse(Httpreq.responseText);
    return json;          
}

  longestBearish(prices = []){
    var longest = 0;
    var current = 0;
    for (let i = 1; i < prices.length; i++){
      if (prices[i][1] < prices[i - 1][1]){
        current += 1;
        if ( current > longest){
            longest = current;
        }
      }
      else{
        current = 0;
      }
    }
    return longest;
  }

  highestVolume(volume = []){
    var highest = 0;
    var highestTime = 0;
    for (let i = 0; i < volume.length; i++){
      if (volume[i][1] > highest){
        highest = volume[i][1];
        highestTime = volume[i][0];
      }
    }
    return [highestTime.toString(), highest.toString()]
  }

  maximumProfit(prices = []){
    var lowestTime = prices[0][0];
    var lowestPrice = prices[0][1];
    var differenceStartTime = 0
    var differenceEndTime = 0;
    var differenceAmount = 0;
    for (let i = 1; i < prices.length; i++){
      if(prices[i][1] - lowestPrice > differenceAmount){
        differenceAmount = prices[i][1] - lowestPrice;
        differenceStartTime = lowestTime;
        differenceEndTime = prices[i][0];
      }
      if(prices[i][1] < lowestPrice){
        lowestPrice = prices[i][1];
        lowestTime = prices[i][0];
      }
    }
    if(differenceStartTime == differenceEndTime){
      return [];
    }
    differenceStartTime.toString();
    return [new Date(differenceStartTime), new Date(differenceEndTime)];
  } 

  analyzeDates(times = []){
    let url = 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur&from=' + times[0] + '&to=' + times[1];
    var json = this.getJson(url);
    let highVolume = [];
    let profitDates = [];
    let longestDecrease = this.longestBearish(json.prices);
    highVolume = this.highestVolume(json.total_volumes);
    profitDates = this.maximumProfit(json.prices);
    console.log(longestDecrease)
    console.log(highVolume)
    console.log(profitDates)
    return [longestDecrease, highVolume, profitDates]
  }
}
