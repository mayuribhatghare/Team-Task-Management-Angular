import { Routes } from '@angular/router';
import { authRoutes } from './features/auth/auth-routing.module';
import { RegisterComponent } from './features/auth/register/register.component';
import { userRoutes } from './features/users/users-routing-modules';
import { managerRoutes } from './features/manager/manager-routing-module';

export const routes: Routes = [
  {
    path: 'auth',
    children: authRoutes
  },
  {
    path : 'users',
    children: userRoutes
  },
  {
    path:'manager',
    children:managerRoutes
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
   {
    path: '**',
    redirectTo: 'auth/login' // Optional fallback
  }
  
];
