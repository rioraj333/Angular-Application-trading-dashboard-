import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { Dashbaord } from './dashbaord/dashbaord';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: Dashbaord,
    pathMatch: 'full',
  },
];
