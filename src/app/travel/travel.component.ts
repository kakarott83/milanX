import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormArray, FormBuilder } from '@angular/forms';
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

@Component({
  selector: 'app-travel',
  standalone: true,
  imports: [MaterialModule, GUIModule,AsyncPipe, CommonModule],
  templateUrl: './travel.component.html',
  styleUrl: './travel.component.scss',
  providers:[provideNativeDateAdapter(), CustomerService, JsonPipe],
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
  

  travelForm = this.fb.group({
    customer: [''],
    city: [''],
    country: [''],
    startDate: [''],
    startHours: [''],
    startMinutes: [''],
    endDate: [''],
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
      launch: item.launch,
      dinner: item.dinner,
      value: 0
    })
    this.days.push(daysForm)
  }

  removeDaysItems() {
    this.travelForm.controls.days.clear()
  }

  createDays() {
    let s = this.travelForm.controls.startDate.value
    let e = this.travelForm.controls.endDate.value

    this.removeDaysItems()

    if(s !==null && s !== '' && e !== null && e !== '') {
      this.helperService.createDaysItems(new Date(s), new Date(e)).subscribe(data => {
        data.forEach(d => {
          this.addDaysItem(d);
        })
        //this.days.push(this.calcService.calculateDays(this.days))
        
      })
    }


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
      this.createDays()
    })
    //End
    this.travelForm.controls.endDate.valueChanges.subscribe(value => {
      this.createDays()
    })
  }

  public selectedCustomer(customer: any) {
    if(customer) {
      this.travelForm.patchValue({
        city: customer.city,
        country: customer.country
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
    
}
