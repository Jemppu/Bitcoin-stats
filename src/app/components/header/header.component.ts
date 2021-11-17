import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/services/analytics.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  title: string = 'Scrooges Bitcoin calculator';
  longestBearish: number = 0;
  highestVolume: string[] = [];
  maximumProfit: Date[] = [];

  bearishText: string = 'bearishtext will be displayed here'
  highestVolumeText: string = 'highestvolumetext will be displayed here'
  maximumProfitText: string = 'maximumprofit text will be displayed here'

  constructor(private analyticsService: AnalyticsService) { 
  }

  ngOnInit(): void {}

  searchTimePeriod(times: Date[] = []){
    var startUnix = times[0].getTime()/1000;
    var endUnix = times[1].getTime()/1000 + 3600;
    let url = 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur&from=' + startUnix + '&to=' + endUnix;
    var json = this.analyticsService.getJson(url);
    var prices = []
    var total_volumes = []
    //api gives results for every hour when query is shorter than 90 days, picking data for once per day
    if(times[1].getTime()-times[0].getTime() < 7776000){
      for (let i = 0; i < json.prices.length; i += 24){
        prices.push(json.prices[i])
        total_volumes.push(json.total_volumes[i])
      }
    }
    else{
      prices = json.prices
      total_volumes = json.total_volumes
    }
    this.longestBearish = this.analyticsService.longestBearish(prices);
    this.highestVolume = this.analyticsService.highestVolume(total_volumes);
    this.maximumProfit = this.analyticsService.maximumProfit(prices);
    console.log(this.longestBearish)
    console.log(this.highestVolume)
    console.log(this.maximumProfit)
    var formattedStartTime = times[0].getFullYear() + "-" + (times[0].getMonth() + 1) + '-' + times[0].getDate();
    var formattedEndTime = times[1].getFullYear() + "-" + (times[1].getMonth() + 1) + '-' + times[1].getDate();

    this.bearishText = "In bitcoin’s historical data from CoinGecko, the price decreased " + this.longestBearish + " days in a row for the inputs from " + formattedStartTime + "and to " + formattedEndTime;
    var volumeTime = new Date (parseInt(this.highestVolume[0]))
    var formattedVolumeTime = volumeTime.getFullYear() + "-" + (volumeTime.getMonth() + 1) + '-' + volumeTime.getDate();

    this.highestVolumeText = "and highest volume was on " + formattedVolumeTime + " at " + this.highestVolume[1] + "€";

    var formattedMaxProfitStart = this.maximumProfit[0].getFullYear() + "-" + (this.maximumProfit[0].getMonth() + 1) + '-' + this.maximumProfit[0].getDate();
    var formattedMaxProfitEnd = this.maximumProfit[1].getFullYear() + "-" + (this.maximumProfit[1].getMonth() + 1) + '-' + this.maximumProfit[1].getDate();

    this.maximumProfitText = 'During selected time period, Scrooges profit would be maximized if he bought on ' + formattedMaxProfitStart + ' and sold on ' + formattedMaxProfitEnd;

  }
}
