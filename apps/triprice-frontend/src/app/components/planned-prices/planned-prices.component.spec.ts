import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannedPricesComponent } from './planned-prices.component';

describe('PlannedPricesComponent', () => {
  let component: PlannedPricesComponent;
  let fixture: ComponentFixture<PlannedPricesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlannedPricesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlannedPricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
