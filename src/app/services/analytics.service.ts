import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor() { }

  datesToUnix(dates = [new Date]){
    let datesUnix = [];
    for (var date of dates){
      datesUnix.push(date.getTime()/1000 + 3600);
    }
    return datesUnix
  }

  getJson(url = 'string'){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",url,false);
    Httpreq.send(null);
    var json = JSON.parse(Httpreq.responseText);
    return json;          
}


  analyzeDates(){
    let dates = [new Date ('2015.05.03'), new Date ('2016.05.03')];
    let datesUnix = this.datesToUnix(dates);
    let url = 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur&from=' + datesUnix[0] + '&to=' + datesUnix[1];
    var json = this.getJson(url);
    console.log(json);
  }

  getAnalytics() {
    return 'success'
  }
}
