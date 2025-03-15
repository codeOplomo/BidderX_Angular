import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersDashComponent } from './users-dash.component';

describe('UsersDashComponent', () => {
  let component: UsersDashComponent;
  let fixture: ComponentFixture<UsersDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersDashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
