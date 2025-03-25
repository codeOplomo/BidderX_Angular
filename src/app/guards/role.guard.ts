import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, take } from 'rxjs';
import { selectUserRoles } from '../store/auth/auth.selectors';


export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  const store = inject(Store);
  const router = inject(Router);
  const requiredRoles = route.data['roles'] as Array<string>;

  return store.select(selectUserRoles).pipe(
    take(1),
    map(userRoles => {
      if (!userRoles || userRoles.length === 0) {
        return router.createUrlTree(['/']);
      }
      if (requiredRoles && !requiredRoles.some(role => userRoles.includes(role))) {
        return router.createUrlTree(['/']);
      }
      return true;
    })
  );
};
