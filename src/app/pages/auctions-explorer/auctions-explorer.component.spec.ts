import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionsExplorerComponent } from './auctions-explorer.component';

describe('AuctionsExplorerComponent', () => {
  let component: AuctionsExplorerComponent;
  let fixture: ComponentFixture<AuctionsExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuctionsExplorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuctionsExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
