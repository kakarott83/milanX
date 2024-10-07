import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor() { }

  data = {
    countries: [
      {'name': 'Schweiz',
        'rate': 64,
        'partRate': 32
      },
      {'name': 'Österreich',
        'rate': 36,
        'partRate': 24
      },
      {'name': 'Schweiz',
        'rate': 24,
        'partRate': 12
      }
    ]
  }

  getCountries() {
    return of (this.data)
  }

  getCountryByName(name: string) {
    return of (
      this.data.countries.find(c => c.name == name)
    )
  }
}
