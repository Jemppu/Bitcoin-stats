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
      .then(data => {
        this.longestBearish = data[0],
        this.highestVolume = data[1],
        this.formattedVolumeTime = data[2],
        this.formattedMaxProfitStart = data[3],
        this.formattedMaxProfitEnd = data[4]
      });

    this.formattedStartTime = `${times[0].getFullYear()}-${times[0].getMonth() + 1}-${times[0].getDate()}`;
    this.formattedEndTime = `${times[1].getFullYear()}-${times[1].getMonth() + 1}-${times[1].getDate()}`;

  }
}
