import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, exhaustMap, map, of, Subject, tap } from "rxjs";
import { UserService } from "../../services/user.service";
import { Store } from "@ngrx/store";
import * as WalletActions from "../wallet/wallet.actions";
import { WalletService } from "../../services/wallet.service";

@Injectable()
export class WalletEffects {
  private readonly actions$ = inject(Actions);
  private readonly walletService = inject(WalletService);

  connect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(WalletActions.connectWallet),
      exhaustMap(({ request }) =>
        this.walletService.connectWallet(request).pipe(
          tap(response => {
            const checkoutUrl = response.data.checkoutUrl;
            if (checkoutUrl) {
              // Redirect to the checkout URL
              window.location.href = checkoutUrl;
            }
          }),
          map(response => WalletActions.connectWalletSuccess({ wallet: response.data })),
          catchError(error => of(WalletActions.connectWalletFailure({ error: error.message })))
        )
      )
    );
  });
  

  deposit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(WalletActions.depositFunds),
      exhaustMap(({ request }) =>
        this.walletService.depositFunds(request).pipe(
          tap(response => {
            const checkoutUrl = response.data.checkoutUrl;
            if (checkoutUrl) {
              window.location.href = checkoutUrl;
            }
          }),
          map(response => WalletActions.depositFundsSuccess({ wallet: response.data })),
          catchError(error => of(WalletActions.depositFundsFailure({ error: error.message })))
        )
      )
    );
  });
  

}