import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductImagesUploadsComponent } from './product-images-uploads.component';

describe('ProductImagesUploadsComponent', () => {
  let component: ProductImagesUploadsComponent;
  let fixture: ComponentFixture<ProductImagesUploadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductImagesUploadsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductImagesUploadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
