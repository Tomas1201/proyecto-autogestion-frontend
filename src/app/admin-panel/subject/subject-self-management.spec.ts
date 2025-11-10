import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectSelfManagement } from './subject-self-management';

describe('SubjectSelfManagement', () => {
  let component: SubjectSelfManagement;
  let fixture: ComponentFixture<SubjectSelfManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectSelfManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectSelfManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
