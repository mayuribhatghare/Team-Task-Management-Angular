import { CanActivateFn,Router } from "@angular/router";
import {inject} from '@angular/core';
import { AuthService } from "../services/auth.service";

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    debugger
    const router = inject(Router);
    const authService = inject(AuthService)
    const user = authService.getUserIdFromToken()

    if (user && allowedRoles.includes(user.Role)) {
      debugger
      return true; // ✅ allow access
    }

    // ❌ unauthorized: redirect to login (or error page)
    router.navigate(['/auth/login']);
    return false;
  };
};