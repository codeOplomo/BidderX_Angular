import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowcaseHeaderComponent } from './showcase-header.component';

describe('ShowcaseHeaderComponent', () => {
  let component: ShowcaseHeaderComponent;
  let fixture: ComponentFixture<ShowcaseHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowcaseHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowcaseHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
