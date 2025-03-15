import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartStatsComponent } from './chart-stats.component';

describe('ChartStatsComponent', () => {
  let component: ChartStatsComponent;
  let fixture: ComponentFixture<ChartStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
