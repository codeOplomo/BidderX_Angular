import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsSelectingDialogComponent } from './products-selecting-dialog.component';

describe('ProductsSelectingDialogComponent', () => {
  let component: ProductsSelectingDialogComponent;
  let fixture: ComponentFixture<ProductsSelectingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsSelectingDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsSelectingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
