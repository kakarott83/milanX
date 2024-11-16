import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor() { }

  private data = {
    countries: [
      {'name': 'Schweiz',
        'rate': 64,
        'partRate': 32
      },
      {'name': 'Österreich',
        'rate': 36,
        'partRate': 24
      },
      {'name': 'Deutschland',
        'rate': 24,
        'partRate': 12
      }
    ]
  }

  getCountries() {
    return of (this.data)
  }

  getCountryByName(name: string) {
    return this.data.countries.find(c => c.name == name)
  }
}
