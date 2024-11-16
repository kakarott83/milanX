import { Injectable } from '@angular/core';
import moment from 'moment';
import { of } from 'rxjs';
import { CalculateService } from './calculate.service';
import { CustomerService } from './customer.service';
import { CountryService } from './country.service';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(
    private calcService: CalculateService,
    private customerService: CustomerService,
    private countryService: CountryService
  ) { }

  createDaysItems(start: Date, end: Date) {
    let s = moment(start)
    let e = moment(end)
    let diff = e.diff(s, 'days')
    let daysArray = []
    console.log(diff,'Diff')

    //First Day
    daysArray.push(this.createDay(0,start, 60))

    //other Days
    for (let index = 1; index <= diff; index++) {
      const element = s.add(1, 'days');
      daysArray.push(this.createDay(index, element.toDate(), 60))
    }

    return of(daysArray)

  }



  createDaysInit(countryName: string, start: Date, end: Date) {

    let daysArray = [];
    let customer;
    let country = this.countryService.getCountryByName(countryName);

    let s = moment(start);
    let e = moment(end);
    let diffDays = e.diff(s, 'days');
    let diffHours = e.diff(s, 'hours');

    console.log(diffDays,'diffDays')
    console.log(diffHours,'DiffHours')

    //First Day
    if(diffDays === 0 && diffHours < 8) {
      daysArray.push(this.createDay(0,start, 0));
    } else {
      daysArray.push(this.createDay(0,start, country?.partRate));
    }

    //other Days
    for (let index = 1; index <= diffDays; index++) {
      const element = s.add(1, 'days');
      daysArray.push(this.createDay(index, element.toDate(), country?.rate));
    }

    console.log(daysArray,'daysArray');

    return daysArray

  }

  private createDay(pos: number, date: Date, defAmount: number = 0) {
    
    let defaultBreakfast = true
    let totalAmount = defAmount

    if(pos === 0) {
      defaultBreakfast = false;
    } else {
      totalAmount = defAmount * 0.8
    }


    return {
      position: pos,
       date: date, 
       breakfast: defaultBreakfast, 
       lunch: false, 
       dinner: false, 
       amount: totalAmount, 
       displayAmount: this.formatCurrency(totalAmount),
       defaultAmount: defAmount 
      }
  }

  isNumber(value: any) {
    return typeof value === 'number' ? true : false;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  }

  createHours(): string[] {
    let hoursArr: string[] = [];

    for (let index = 0; index < 24; index++) {
      hoursArr.push(index.toString())
    }
    return hoursArr;
  }


}
