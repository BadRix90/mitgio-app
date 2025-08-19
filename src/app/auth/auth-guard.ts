import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is authenticated (using signal)
  const currentUser = authService.currentUser();
  
  console.log('Auth Guard Check:', {
    currentUser: !!currentUser,
    route: state.url,
    isLoading: authService.isLoading()
  });
  
  // If still loading, wait a bit
  if (authService.isLoading()) {
    console.log('Auth Guard: Still loading...');
    return false; // Or implement proper loading handling
  }
  
  if (currentUser) {
    // User is logged in
    console.log('Auth Guard: User authenticated, allowing access');
    return true;
  } else {
    // User is not logged in, redirect to login
    console.log('Auth Guard: User not authenticated, redirecting to login');
    router.navigate(['/login']);
    return false;
  }
};