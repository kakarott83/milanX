import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  
  private data = {
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

  getCustomerByName(name: string) {
    const customer = this.data.customers.find(x => x.name == name)
    return customer
  }



}
