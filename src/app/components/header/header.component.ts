import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/services/analytics.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  title: string = 'Scrooges Bitcoin calculator';
  longestBearish: string;
  highestVolume: string;

  formattedStartTime: string;
  formattedEndTime: string;
  formattedVolumeTime: string;
  formattedMaxProfitStart: string;
  formattedMaxProfitEnd: string;
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
        this.longestBearish = data.get("longestDecrease")!,
          this.highestVolume = data.get("highestVolume")!,
          this.formattedVolumeTime = data.get("highestVolumeTime")!,
          this.formattedMaxProfitStart = data.get("highestProfitStart")!,
          this.formattedMaxProfitEnd = data.get("highestProfitEnd")!,
          //return value of data[3] is empty if there is no possibility of profit on given days.
          //Changes html text visibility accordingly.
          this.profitToBeMade = data.get("highestProfitStart")! != "",
          this.profitNotToBeMade = data.get("highestProfitStart")! == "",
          //changing the visibility of entire text in html if there is an error found or not
          this.showText = data.get("longestDecrease")! != "data not found",
          this.error = data.get("longestDecrease")! == "data not found"
      });

    this.formattedStartTime = `${dates[0].getFullYear()}-${dates[0].getMonth() + 1}-${dates[0].getDate()}`;
    this.formattedEndTime = `${dates[1].getFullYear()}-${dates[1].getMonth() + 1}-${dates[1].getDate()}`;

  }
}
