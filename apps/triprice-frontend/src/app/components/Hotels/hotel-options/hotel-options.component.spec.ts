import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelOptionsComponent } from './hotel-options.component';

describe('HotelOptionsComponent', () => {
  let component: HotelOptionsComponent;
  let fixture: ComponentFixture<HotelOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HotelOptionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HotelOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
