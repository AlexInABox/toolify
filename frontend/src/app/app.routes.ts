import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'currency',
    loadComponent: () => import('./currency/currency.component').then((m) => m.CurrencyComponent)
  },
  {
    path: 'compress',
    loadComponent: () => import('./compress/compress.component').then((m) => m.CompressComponent)
  },
  {
    path: 'favicon',
    loadComponent: () => import('./favicon/favicon.component').then((m) => m.FaviconComponent)
  },
  {
    path: 'package',
    loadComponent: () => import('./zip/zip.component').then((m) => m.ZipComponent)
  },
  {
    path: 'qrcode',
    loadComponent: () => import('./qrcode/qrcode.component').then((m) => m.QRCodeComponent)
  },
  {
    path: 'gif',
    loadComponent: () => import('./gif/gif.component').then((m) => m.GifComponent)
  }
];