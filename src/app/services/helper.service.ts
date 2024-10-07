import { Injectable } from '@angular/core';
import moment from 'moment';
import { of } from 'rxjs';
import { CalculateService } from './calculate.service';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(
    private calcService: CalculateService
  ) { }

  createDaysItems(start: Date, end: Date) {
    let s = moment(start)
    let e = moment(end)
    let diff = e.diff(s, 'days')
    let daysArray = []
    console.log(diff,'Diff')

    //First Day
    daysArray.push(this.createDay(0,start))

    //other Days
    for (let index = 1; index <= diff; index++) {
      const element = s.add(1, 'days');
      daysArray.push(this.createDay(index, element.toDate()))
    }

    return of(daysArray)

  }

  private createDay(pos: number, date: Date) {
    return {position: pos, date: date, breakfast: true, launch: false, dinner: false, amount: 0 }
  }


}
