import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dev',
    loadComponent: () => import('./dev-dashboard/dev-dashboard').then(c => c.DevDashboardComponent)
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];