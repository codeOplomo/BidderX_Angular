import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceBidDialogComponent } from './place-bid-dialog.component';

describe('PlaceBidDialogComponent', () => {
  let component: PlaceBidDialogComponent;
  let fixture: ComponentFixture<PlaceBidDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaceBidDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaceBidDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
