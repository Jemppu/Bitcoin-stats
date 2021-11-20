import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/services/analytics.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  title: String = 'Scrooges Bitcoin calculator';
  longestBearish: String;
  highestVolume: String;

  highestVolumeText: String = 'highestvolumetext will be displayed here'
  maximumProfitText: String = 'maximumprofit text will be displayed here'
  formattedStartTime: String;
  formattedEndTime: String;
  formattedVolumeTime: String;
  formattedMaxProfitStart: String;
  formattedMaxProfitEnd: String;

  constructor(private analyticsService: AnalyticsService) {
  }

  ngOnInit(): void { }

  searchTimePeriod(times: Date[]) {
    this.analyticsService.analyzeDates(times)
    .then(response => response)
    .then(data => {this.longestBearish = data[0], this.highestVolume = data[1], this.formattedVolumeTime = data[2], this.formattedMaxProfitStart = data[3], this.formattedMaxProfitEnd = data[4]});
    
    this.formattedStartTime = `${times[0].getFullYear()}-${times[0].getMonth() + 1}-${times[0].getDate()}`;
    this.formattedEndTime = `${times[1].getFullYear()}-${times[1].getMonth() + 1}-${times[1].getDate()}`;
    /*
    this.analyticsService.getJson(times).then(response => response.json()).then(data => this.json =data);
    var prices = []
    var total_volumes = []
    //api gives results for every hour when query is shorter than 90 days, picking data for once per day
    if (times[1].getTime() - times[0].getTime() < 7776000) {
      for (let i = 0; i < this.json.prices.length; i += 24) {
        prices.push(this.json.prices[i])
        total_volumes.push(this.json.volumes[i])
      }
    }
    else {
      prices = this.json.prices
      total_volumes = this.json.volumes
    }
    //this.highestVolume = this.analyticsService.highestVolume(total_volumes);
    this.maximumProfit = this.analyticsService.maximumProfit(prices);

    /*var volumeTime = new Date(parseInt(this.highestVolume[0]))
    this.formattedVolumeTime = `${volumeTime.getFullYear()}-${volumeTime.getMonth() + 1}-${volumeTime.getDate()}`;

    this.highestVolumeText = `and highest volume was on ${this.formattedVolumeTime} at ${this.highestVolume[1]}€`;

    this.formattedMaxProfitStart = `${this.maximumProfit[0].getFullYear()} + "-" + ${this.maximumProfit[0].getMonth() + 1}-${this.maximumProfit[0].getDate()}`;
    this.formattedMaxProfitEnd = `${this.maximumProfit[1].getFullYear()} + "-" + ${this.maximumProfit[1].getMonth() + 1}-${this.maximumProfit[1].getDate()}`;

    this.maximumProfitText = `During selected time period, Scrooges profit would be maximized if he bought on ${this.formattedMaxProfitStart} and sold on ${this.formattedMaxProfitEnd}`;  */

  }
}
