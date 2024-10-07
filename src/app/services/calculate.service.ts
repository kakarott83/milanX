import { Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CalculateService {

  constructor() { }

  calculateDay(formArray: FormArray, rate: number, partRate: number) {
    
    return formArray
    
  }
}
