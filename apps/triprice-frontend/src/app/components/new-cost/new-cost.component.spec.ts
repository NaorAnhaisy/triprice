import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCostComponent } from './new-cost.component';

describe('NewCostComponent', () => {
  let component: NewCostComponent;
  let fixture: ComponentFixture<NewCostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewCostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
