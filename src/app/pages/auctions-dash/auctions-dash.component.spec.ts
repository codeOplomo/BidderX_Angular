import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionsDashComponent } from './auctions-dash.component';

describe('AuctionsDashComponent', () => {
  let component: AuctionsDashComponent;
  let fixture: ComponentFixture<AuctionsDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuctionsDashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuctionsDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
