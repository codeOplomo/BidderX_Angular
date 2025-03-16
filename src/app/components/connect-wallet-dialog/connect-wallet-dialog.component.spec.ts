import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectWalletDialogComponent } from './connect-wallet-dialog.component';

describe('ConnectWalletDialogComponent', () => {
  let component: ConnectWalletDialogComponent;
  let fixture: ComponentFixture<ConnectWalletDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectWalletDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectWalletDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
