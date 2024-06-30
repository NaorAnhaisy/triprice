import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripPricesComponent } from './trip-prices.component';

describe('TripPricesComponent', () => {
  let component: TripPricesComponent;
  let fixture: ComponentFixture<TripPricesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripPricesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripPricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
