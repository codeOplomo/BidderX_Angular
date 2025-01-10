import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionShowcaseComponent } from './collection-showcase.component';

describe('CollectionShowcaseComponent', () => {
  let component: CollectionShowcaseComponent;
  let fixture: ComponentFixture<CollectionShowcaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionShowcaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionShowcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
