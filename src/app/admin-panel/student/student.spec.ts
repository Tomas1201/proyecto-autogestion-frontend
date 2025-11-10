import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentSelfManagement } from './student-self-management';

describe('StudentSelfManagement', () => {
  let component: StudentSelfManagement;
  let fixture: ComponentFixture<StudentSelfManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentSelfManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentSelfManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
