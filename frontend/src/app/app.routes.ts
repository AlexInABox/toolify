import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'currency',
    loadComponent: () => import('./currency/currency.component').then((m) => m.CurrencyComponent)
  },
  {
    path: 'unit',
    loadComponent: () => import('./unitConversion/unit.component').then((m) => m.UnitComponent)
  }
];