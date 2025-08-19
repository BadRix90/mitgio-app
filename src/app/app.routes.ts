import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { authGuard } from './auth/auth-guard';

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
    path: 'register',
    loadComponent: () => import('./auth/register/register').then(c => c.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard').then(c => c.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'members',
    loadComponent: () => import('./members/members-list/members-list').then(c => c.MembersListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'members',
    loadComponent: () => import('./members/members-list/members-list').then(c => c.MembersListComponent),
    canActivate: [authGuard]
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