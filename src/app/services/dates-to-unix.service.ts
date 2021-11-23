import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatesToUnixService {

  constructor() { }

  //simple method that retuns given array of dates as unix timestamps,
  //adds 3 hours to 'to' date for offsetting GMT to UTC conversion and to ensure last date data is included
  datesToUnix(dates: Array<Date>) {
    let datesUnix = [];
    for (var date of dates) {
      datesUnix.push(date.getTime() / 1000);
    }
    datesUnix[1] += 10800;
    return datesUnix
  }
}
