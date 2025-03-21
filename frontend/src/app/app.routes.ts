import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'currency',
    loadComponent: () => import('./currency/currency.component').then((m) => m.CurrencyComponent)
  }
];