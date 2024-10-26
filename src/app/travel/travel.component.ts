import { ChangeDetectionStrategy, Component, OnInit, LOCALE_ID } from '@angular/core';
import { CommonModule, formatDate, JsonPipe } from '@angular/common';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MaterialModule } from '../material.module';
import {provideNativeDateAdapter} from '@angular/material/core';
import { Observable, of, race } from 'rxjs';
import {map, startWith, tap} from 'rxjs/operators';
import { GUIModule } from '../forms.module';
import { AsyncPipe } from '@angular/common';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../model/customer';
import { CountryService } from '../services/country.service';
import { Country } from '../model/country';
import { HelperService } from '../services/helper.service';
import { CalculateService } from '../services/calculate.service';
import { MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

const DE_DATE_FORMATS = {
  parse: {
    dateInput: 'DD.MM.YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-travel',
  standalone: true,
  imports: [MaterialModule, GUIModule,AsyncPipe, CommonModule],
  templateUrl: './travel.component.html',
  styleUrl: './travel.component.scss',
  providers:[
    provideNativeDateAdapter(), 
    CustomerService, 
    JsonPipe,
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
    { provide: MAT_DATE_FORMATS, useValue: DE_DATE_FORMATS },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TravelComponent implements OnInit {

  dateRange: Date[] | undefined;
  timeHourOptions: string[] = ['1','2','3','4','5'];
  timeMinuteOptions: string[] = ['00','15','30','45'];
  customers: any[] = [];
  countries: any[] = [];
  selectedCountry!: Country
  filteredHoursStart!: Observable<string[]>;
  filteredHoursEnd!: Observable<string[]>;
  filteredMinuteStart!: Observable<string[]>;
  filteredMinuteEnd!: Observable<string[]>;
  filteredCustomers!: Observable<any[]>;
  filteredCountries!: Observable<any[]>;
  daysArr: any[] = [];
  

  travelForm = this.fb.group({
    customer: [''],
    city: [''],
    country: [''],
    startDate: [null as Date | null],
    startHours: [''],
    startMinutes: [''],
    endDate: [null as Date | null],
    endHours: [''],
    endMinutes: [''],
    spends: this.fb.array([]),
    days: this.fb.array([]),
    rate: 0,
    partRate: 0
  })


  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private countryService: CountryService,
    private helperService: HelperService,
    private calcService: CalculateService
  ) {}

  ngOnInit(): void {
    this.setFilter()
    this.getCustomerList()
    this.getCountryList()
    this.changeDateTime()
    
  }

  get spends(): FormArray {
    return this.travelForm.controls.spends as FormArray
  }

  get days(): FormArray {
    return this.travelForm.controls.days as FormArray
  }


  addSpendItem(): void {
    const spendForm = this.fb.group({
      type: [''],
      value: [''],
      date: ['']
    })
    this.spends.push(spendForm)
  }

  removeSpendItem(index: number) {
    this.spends.removeAt(index)
  }

  addDaysItem(item: any): void {
    const daysForm = this.fb.group({
      position: item.position,
      date: item.date,
      breakfast: item.breakfast,
      lunch: item.lunch,
      dinner: item.dinner,
      amount: item.amount,
      defAmount: item.defaultAmount
    })
    // daysForm.valueChanges.subscribe(x => {
    //   console.log(x.position,'Pos')
    //   if( this.helperService.isNumber (x.position) && x != undefined) {
    //     this.calcDays(x.position)
    //   }
    // })
    this.days.push(daysForm)
  }

  removeDaysItems() {
    this.travelForm.controls.days.clear()
  }

  setFilter() {
    this.filteredHoursStart = this.travelForm.controls.startHours.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '','HOURS')),
    )

    this.filteredMinuteStart = this.travelForm.controls.startMinutes.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '','MINUTES'))
    )

    this.filteredHoursEnd = this.travelForm.controls.endHours.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '','HOURS')),
    )

    this.filteredMinuteEnd = this.travelForm.controls.endMinutes.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '','MINUTES'))
    )

    this.filteredCustomers = this.travelForm.controls.customer.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '','CUSTOMER'))
    )

    this.filteredCountries = this.travelForm.controls.country.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '','COUNTRY'))
    )
  }

  private _filter(value: string, type: string) {
    const filterValue = value.toLowerCase();

    if(type == 'HOURS') {
      return this.timeHourOptions.filter(option => option.toLowerCase().includes(filterValue))
    }

    if(type == 'MINUTES') {
      return this.timeMinuteOptions.filter(option => option.toLowerCase().includes(filterValue))
    }

    if(type == 'CUSTOMER') {
      return this.customers.filter(option => option.name.toLowerCase().includes(filterValue))
    }

    if(type == 'COUNTRY') {
      return this.countries.filter(option => option.name.toLowerCase().includes(filterValue))
    }

    return ['']

  }

  changeDateTime() {
    //Start
    this.travelForm.controls.startDate.valueChanges.subscribe(value => {
      //this.createDays()
    })
    //End
    this.travelForm.controls.endDate.valueChanges.subscribe(value => {
      //this.createDays()
    })
  }

  public selectedCustomer(customer: any) {
    let today = new Date();

    let startDateInit = new Date(today);
    let endDateInit = new Date(today);
    endDateInit.setDate(today.getDate()+3);

    if(customer) {
      this.travelForm.patchValue({
        city: customer.city,
        country: customer.country,
        startDate: startDateInit,
        endDate: endDateInit,
        startHours: '5',
        startMinutes: '15',
        endHours: '5',
        endMinutes: '15'

      })
      this.selectedCountry = this.countries.find(x => x.name == customer.country)
    }

  }

  getCustomerList() {
    this.customerService.getCustomers().pipe(
      map(c => c.customers.map(
        x => {
          return x
        }
      )
    )
    ).subscribe(data => this.customers = data)
  }

  getCountryList() {
    this.countryService.getCountries().pipe(
      map(c => c.countries.map(
        x => {
          return x
        }
      ))
    ).subscribe(data => this.countries = data)
  }

  clear(type: any) {
    switch(type) {
      case 'customer': {
        this.travelForm.controls.customer.setValue('')
        break;
      }
      case 'endMinutes': {
        this.travelForm.controls.endMinutes.setValue('')
        break
      }
    }
  }

  createInitDays() {

    let s = this.travelForm.controls.startDate.value
    let e = this.travelForm.controls.endDate.value
    let c = this.travelForm.controls.customer.value

    if(c && s && e) {
      this.daysArr = this.helperService.createDaysInit(c, new Date(s), new Date(e))
      this.daysArr.forEach(x => {
        this.addDaysItem(x)
      })
    }
  }

  calcDays(index: any) {
    const item = this.days.at(index) as FormGroup;
    const breakfast = 0.2
    const lunch = 0.4
    const dinner = 0.4
    let factor = 1
    
    if(item.get('breakfast')?.value) {
      factor = factor - breakfast
    }

    if(item.get('lunch')?.value) {
      factor = factor - lunch
    }

    if(item.get('dinner')?.value) {
      factor = factor - dinner
    }
    
    

    item.patchValue({
      amount: item.get('defAmount')?.value * factor
    })
  }
    
}
