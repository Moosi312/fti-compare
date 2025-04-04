import { Routes } from '@angular/router';
import { ComparePageComponent } from './+compare-page/compare-page.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./+compare-page/compare-page.component').then(
        (m) => m.ComparePageComponent,
      ),
  },
];
