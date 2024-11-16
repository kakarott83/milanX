import { ChangeDetectionStrategy, Component, OnInit, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { CommonModule, formatDate, JsonPipe } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormControl } from '@angular/forms';
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
import { MatDateRangeInput } from '@angular/material/datepicker';

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
  timeHourOptions!: string[];
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
  amountControl = new FormControl(0);
  

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

    this.timeHourOptions = this.helperService.createHours();
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
      date: [{value: item.date, disabled: true}],
      breakfast: item.breakfast,
      lunch: item.lunch,
      dinner: item.dinner,
      amount: item.amount,
      displayAmount:[{value: this.helperService.formatCurrency(item.amount), disabled: true}],
      defAmount: item.defaultAmount
    })
    console.log(daysForm,'DaysForm')
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
    this.removeDaysItems();
    this.createInitDays();
  }

  public selectedCustomer(customer: any) {
    this.removeDaysItems()
    let today = new Date();

    let startDateInit = new Date(today);
    let endDateInit = new Date(today);
    endDateInit.setDate(today.getDate()+3);

    if(customer) {
      this.travelForm.patchValue({
        customer: customer.name,
        city: customer.city,
        country: customer.country,
        startDate: startDateInit,
        endDate: endDateInit,
        startHours: '8',
        startMinutes: '15',
        endHours: '18',
        endMinutes: '45'
      })
      this.selectedCountry = this.countries.find(x => x.name == customer.country)
    }
    this.createInitDays();

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
    this.countries = [];
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

    let s = this.travelForm.controls.startDate.value;
    let e = this.travelForm.controls.endDate.value;
    let c = this.travelForm.controls.country.value;
    let startHours = this.travelForm.controls.startHours.value;
    let startMinutes = this.travelForm.controls.startMinutes.value;
    let endHours = this.travelForm.controls.endHours.value;
    let endMinutes = this.travelForm.controls.endMinutes.value;
    let startDateTime 
    let endDateTime 

    if(c && s && e) {

      startDateTime = new Date(s);
      startDateTime.setHours(Number(startHours));
      startDateTime.setMinutes(Number(startMinutes));
      endDateTime = new Date(e);
      endDateTime.setHours(Number(endHours));
      endDateTime.setMinutes(Number(endMinutes));


      this.daysArr = this.helperService.createDaysInit(c, startDateTime, endDateTime)
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

    let value = item.get('defAmount')?.value * factor
    
    

    item.patchValue({
      amount: value,
      displayAmount: this.helperService.formatCurrency(value),
    })
  }


}
