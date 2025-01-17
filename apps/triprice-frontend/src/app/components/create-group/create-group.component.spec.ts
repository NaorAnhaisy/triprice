import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGroupComponent } from './create-group.component';

describe('FlightOptionsComponent', () => {
  let component: CreateGroupComponent;
  let fixture: ComponentFixture<CreateGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
