import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { PlaceBidDialogComponent } from './place-bid-dialog.component';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import * as WalletActions from '../../store/wallet/wallet.actions';
import * as fromAuth from '../../store/auth/auth.selectors';
import * as fromUser from '../../store/user/user.selectors';
import * as fromWallet from '../../store/wallet/wallet.selectors';


describe('PlaceBidDialogComponent', () => {
  let component: PlaceBidDialogComponent;
  let fixture: ComponentFixture<PlaceBidDialogComponent>;
  let storeMock: any;
  const routerMock = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async () => {
    // Enhanced Store mock
    storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);

    // Default mock selector responses
    storeMock.select.and.callFake((selector: any) => {
      if (selector === fromAuth.selectIsAuthenticated) return of(false);
      if (selector === fromUser.selectUser) return of({ hasWallet: false });
      if (selector === fromWallet.selectWalletBalance) return of(100);
      return of(null);
    });

    await TestBed.configureTestingModule({
      imports: [
        DialogModule,
        FormsModule,
        PlaceBidDialogComponent
      ],
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PlaceBidDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test initial state
  it('should initialize with default values', () => {
    expect(component.minimumBid).toBe(0);
    expect(component.auctionId).toBe('');
    expect(component.visible).toBeFalse();
  });

  // Test authentication states
  describe('Authentication states', () => {
    it('should show auth required for unauthenticated users', () => {
      // No need to override storeMock.select as defaults are already false
      fixture.detectChanges();

      const authSection = fixture.nativeElement.querySelector('[data-testid="auth-required"]');
      expect(authSection).toBeTruthy();
    });

    it('should show wallet setup for authenticated users without wallet', () => {
      // Override selectors for this test case
      storeMock.select.and.callFake((selector: any) => {
        if (selector === fromAuth.selectIsAuthenticated) return of(true);
        if (selector === fromUser.selectUser) return of({ hasWallet: false });
        return of(null);
      });
      fixture.detectChanges();

      const walletSection = fixture.nativeElement.querySelector('[data-testid="wallet-required"]');
      expect(walletSection).toBeTruthy();
    });

    it('should show bid form for authenticated users with wallet', () => {
      // Override selectors for this test case
      storeMock.select.and.callFake((selector: any) => {
        if (selector === fromAuth.selectIsAuthenticated) return of(true);
        if (selector === fromUser.selectUser) return of({ hasWallet: true });
        if (selector === fromWallet.selectWalletBalance) return of(100);
        return of(null);
      });
      fixture.detectChanges();

      const bidForm = fixture.nativeElement.querySelector('[data-testid="bid-form"]');
      expect(bidForm).toBeTruthy();
    });
  });

  describe('Bid Submission', () => {
    beforeEach(() => {
      component.minimumBid = 50;
      component.auctionId = 'test-auction';
      storeMock.select.and.callFake((selector: any) => {
        if (selector === fromAuth.selectIsAuthenticated) return of(false);
        if (selector === fromUser.selectUser) return of({ hasWallet: false });
        if (selector === fromWallet.selectWalletBalance) return of(0);
        return of(null);
      });
      fixture.detectChanges();
    });

    it('should validate bid amount', () => {
      component.bidAmount = 30;
      expect(component.validateBid()).toBeFalse();

      component.bidAmount = 50;
      expect(component.validateBid()).toBeTrue();
    });

    it('should handle insufficient balance', fakeAsync(() => {
      // Reset dispatch calls after component initialization
      storeMock.dispatch.calls.reset();

      component.bidAmount = 150;
      storeMock.select.and.returnValue(of(100));

      component.submitBid();
      tick();

      expect(component.insufficientBalance).toBeTrue();

      // Verify no balance update was dispatched
      expect(storeMock.dispatch).not.toHaveBeenCalledWith(
        WalletActions.updateWalletBalance({ newBalance: jasmine.any(Number) as unknown as number })
      );
    }));

    // Update test setup for bid submission
    it('should dispatch wallet update on valid bid', fakeAsync(() => {
      // Set initial balance
      storeMock.select.and.returnValue(of(100));
      component.walletBalance$ = of(100);

      const emitSpy = spyOn(component.bidSubmitted, 'emit');
      component.bidAmount = 75;

      component.submitBid();
      tick();

      expect(storeMock.dispatch).toHaveBeenCalledWith(
        WalletActions.updateWalletBalance({ newBalance: 25 })
      );
      expect(emitSpy).toHaveBeenCalledWith(75);
      expect(component.insufficientBalance).toBeFalse();
    }));
  });

  // Test navigation
  describe('Navigation', () => {
    it('should navigate to login', () => {
      component.navigateTo('/login');
      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
      expect(component.visible).toBeFalse();
    });

    it('should navigate to wallet setup', () => {
      component.navigateTo('/wallet');
      expect(routerMock.navigate).toHaveBeenCalledWith(['/wallet']);
      expect(component.visible).toBeFalse();
    });
  });

  // Test dialog visibility
  it('should update visibility', () => {
    const emitSpy = spyOn(component.visibleChange, 'emit');
    component.visible = true;

    expect(component.visible).toBeTrue();
    expect(emitSpy).toHaveBeenCalledWith(true);
  });

  // Test form reset
  it('should reset form on close', () => {
    component.bidAmount = 100;
    component.loading = true;
    component.onClose();

    expect(component.bidAmount).toBeUndefined();
    expect(component.loading).toBeFalse();
  });
});