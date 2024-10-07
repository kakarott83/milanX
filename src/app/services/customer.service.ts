import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  
  data = {
    customers: [
      {
        "name": "BANK-now",
        "city": "Horgen",
        "country": "Schweiz"
    },
    {
        "name": "TFS",
        "city": "Wien",
        "country": "Österreich"
    }
    ]
  }

  constructor() { }

  getCustomers() {
    return of(this.data)
  }
}
