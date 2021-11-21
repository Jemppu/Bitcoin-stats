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
  showText: boolean = false;
  profitToBeMade: boolean = false;
  profitNotToBeMade: boolean = false;
  error: boolean = false;

  constructor(private analyticsService: AnalyticsService) {
  }

  ngOnInit(): void { }

  searchTimePeriod(dates: Date[]) {
    this.showText = false;

    this.analyticsService.analyzeDates(dates)
      .then(data => {
        this.showText = true;
        this.longestBearish = data[0],
          this.highestVolume = data[1],
          this.formattedVolumeTime = data[2],
          this.formattedMaxProfitStart = data[3],
          this.formattedMaxProfitEnd = data[4],
          //return value of data[3] is empty if there is no possibility of profit on given days.
          //Changes html text visibility accordingly.
          this.profitToBeMade = data[3] != "",
          this.profitNotToBeMade = data[3] == "",
          //changing the visibility of entire text in html if there is an error found or not
          this.showText = data[0] != "data not found",
          this.error = data[0] == "data not found"
      });

    this.formattedStartTime = `${dates[0].getFullYear()}-${dates[0].getMonth() + 1}-${dates[0].getDate()}`;
    this.formattedEndTime = `${dates[1].getFullYear()}-${dates[1].getMonth() + 1}-${dates[1].getDate()}`;

  }
}
