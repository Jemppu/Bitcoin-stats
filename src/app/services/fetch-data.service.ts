import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FetchDataService {

  constructor() { }

  //fetch the json from api for given dates
  getJson = async (datesUnix: Array<number>) => {
    let url: string = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur&from=${datesUnix[0]}&to=${datesUnix[1]}`;
    return await window.fetch(url)
  }
}