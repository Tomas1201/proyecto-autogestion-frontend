import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-edit-subject',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './edit-subject.html',
  styleUrls: ['./edit-subject.css']
})
export class EditSubjectComponent {
  subjectForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditSubjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.subjectForm = this.fb.group({
      name: [data.name, Validators.required],
      code: [data.code, Validators.required],
      classes: [data.classes, Validators.required]
    });
  }

  onSubmit() {
    if (this.subjectForm.valid) {
      this.dialogRef.close(this.subjectForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
