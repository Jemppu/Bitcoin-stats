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
  searchTimePeriod(times: Date[]) {
    this.showText = false;
    this.analyticsService.analyzeDates(times)
      .then(data => {
        this.showText = true;
        this.longestBearish = data[0],
          this.highestVolume = data[1],
          this.formattedVolumeTime = data[2],
          this.formattedMaxProfitStart = data[3],
          this.formattedMaxProfitEnd = data[4],
          this.profitToBeMade = data[3] != "",
          this.profitNotToBeMade = data[3] == "",
          this.showText = data[0] != "data not found",
          this.error = data[0] == "data not found"
      });

    this.formattedStartTime = `${times[0].getFullYear()}-${times[0].getMonth() + 1}-${times[0].getDate()}`;
    this.formattedEndTime = `${times[1].getFullYear()}-${times[1].getMonth() + 1}-${times[1].getDate()}`;

  }
}
