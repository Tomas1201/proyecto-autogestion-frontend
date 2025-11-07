import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerSelfManagement } from './career-self-management';

describe('CareerSelfManagement', () => {
  let component: CareerSelfManagement;
  let fixture: ComponentFixture<CareerSelfManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CareerSelfManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CareerSelfManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
