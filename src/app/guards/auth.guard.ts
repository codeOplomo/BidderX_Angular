import { inject } from "@angular/core";
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { selectIsAuthenticated, selectUserRoles } from "../store/auth/auth.selectors";

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    map(isAuthenticated => {
      if (!isAuthenticated) {
        return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
      }
      return true;
    })
  );
};

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
