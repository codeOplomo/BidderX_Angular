import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductChoiceDialogComponent } from './product-choice-dialog.component';

describe('ProductChoiceDialogComponent', () => {
  let component: ProductChoiceDialogComponent;
  let fixture: ComponentFixture<ProductChoiceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductChoiceDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductChoiceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
