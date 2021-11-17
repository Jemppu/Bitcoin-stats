import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/services/analytics.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  title: string = 'Scrooges Bitcoin calculator';

  constructor(private analyticsService: AnalyticsService) { }

  ngOnInit(): void {}

  searchTimePeriod(){
    this.analyticsService.analyzeDates()
    console.log("app-date-picker")
  }
}
