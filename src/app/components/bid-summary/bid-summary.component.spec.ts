import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidSummaryComponent } from './bid-summary.component';

describe('BidSummaryComponent', () => {
  let component: BidSummaryComponent;
  let fixture: ComponentFixture<BidSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BidSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BidSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
