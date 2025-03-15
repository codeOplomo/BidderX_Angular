import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionStatusChartComponent } from './auction-status-chart.component';

describe('AuctionStatusChartComponent', () => {
  let component: AuctionStatusChartComponent;
  let fixture: ComponentFixture<AuctionStatusChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuctionStatusChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuctionStatusChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
