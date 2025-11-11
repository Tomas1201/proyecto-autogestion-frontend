import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailField } from './email-field';

describe('EmailField', () => {
  let component: EmailField;
  let fixture: ComponentFixture<EmailField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailField]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailField);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
