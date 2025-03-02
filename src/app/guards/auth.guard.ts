import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn$.pipe(
    take(1),
    map(isLoggedIn => {
      // Check if the route requires specific roles
      const requiredRoles = route.data['roles'] as Array<string>;
      
      if (!isLoggedIn) {
        // Store the attempted URL for redirecting after login
        return router.createUrlTree(['/login'], {
          queryParams: { returnUrl: state.url }
        });
      }

      // If roles are specified, check if user has required roles
      if (requiredRoles) {
        const hasRequiredRole = requiredRoles.some(role => 
          authService.hasRole(role)
        );

        if (!hasRequiredRole) {
          // Redirect to home or unauthorized page if user doesn't have required role
          return router.createUrlTree(['/']);
        }
      }

      return true;
    })
  );
};
