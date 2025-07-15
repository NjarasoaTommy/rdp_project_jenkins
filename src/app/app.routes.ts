import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tri-color-fire',
    loadComponent: () =>
      import('./tri-color-fire/tri-color-fire.component').then(
        (m) => m.TriColorFireComponent
      ),
  },
  {
    path: '',
    loadComponent: () =>
      import('./tri-color-fire/tri-color-fire.component').then(
        (m) => m.TriColorFireComponent
      ),
  },
];
