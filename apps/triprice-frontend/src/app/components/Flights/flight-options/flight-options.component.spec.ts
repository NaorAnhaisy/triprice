import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightOptionsComponent } from './flight-options.component';

describe('FlightOptionsComponent', () => {
  let component: FlightOptionsComponent;
  let fixture: ComponentFixture<FlightOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlightOptionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FlightOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
