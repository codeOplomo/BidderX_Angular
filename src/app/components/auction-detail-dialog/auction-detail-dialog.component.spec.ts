import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionDetailDialogComponent } from './auction-detail-dialog.component';

describe('AuctionDetailDialogComponent', () => {
  let component: AuctionDetailDialogComponent;
  let fixture: ComponentFixture<AuctionDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuctionDetailDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuctionDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
