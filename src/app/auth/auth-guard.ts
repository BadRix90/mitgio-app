import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is authenticated (using signal)
  const currentUser = authService.currentUser();
  
  if (currentUser) {
    // User is logged in
    return true;
  } else {
    // User is not logged in, redirect to login
    console.log('Auth Guard: User not authenticated, redirecting to login');
    router.navigate(['/login']);
    return false;
  }
};