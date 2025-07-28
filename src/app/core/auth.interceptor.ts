
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@authService/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  debugger
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    debugger
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
