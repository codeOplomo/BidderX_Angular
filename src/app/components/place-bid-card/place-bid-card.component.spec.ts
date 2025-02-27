import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceBidCardComponent } from './place-bid-card.component';

describe('PlaceBidCardComponent', () => {
  let component: PlaceBidCardComponent;
  let fixture: ComponentFixture<PlaceBidCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaceBidCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaceBidCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
