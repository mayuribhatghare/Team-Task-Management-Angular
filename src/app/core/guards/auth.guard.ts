import { CanActivateFn, Router } from '@angular/router';
import {inject} from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  debugger
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.isLoggedIn()){
      return true;
  }

  router.navigate(['/auth/login']);
  return false;

};
