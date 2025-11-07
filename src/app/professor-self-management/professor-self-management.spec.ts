import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorSelfManagement } from './professor-self-management';

describe('ProfessorSelfManagement', () => {
  let component: ProfessorSelfManagement;
  let fixture: ComponentFixture<ProfessorSelfManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessorSelfManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessorSelfManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
