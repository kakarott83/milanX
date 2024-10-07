import { Routes } from '@angular/router';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { LogInComponent } from './auth/log-in/log-in.component';
import { HomeComponent } from './home/home.component';
import { TravelComponent } from './travel/travel.component';

export const routes: Routes = [
    {path: 'signin', component: SignInComponent},
    {path: 'login', component: LogInComponent},
    {path: 'travel', component: TravelComponent},
    {path: '', component: HomeComponent, pathMatch: 'full'},
    {path: '*', component: HomeComponent}
];
