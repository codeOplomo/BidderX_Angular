import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingOwnersCardComponent } from './ranking-owners-card.component';

describe('RankingOwnersCardComponent', () => {
  let component: RankingOwnersCardComponent;
  let fixture: ComponentFixture<RankingOwnersCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RankingOwnersCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RankingOwnersCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
