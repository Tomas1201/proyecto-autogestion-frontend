import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { last } from 'rxjs';

@Component({
  selector: 'app-edit-student',
  imports: [MatDialogModule, MatIconModule, FormsModule, MatInputModule, MatSelectModule],
  templateUrl: './edit-student.html',
  styleUrl: './edit-student.css',
})
export class EditStudent {



  student = {
    name: '',
    lastName: '',
    email: '',
    dni: 1,
    career: [] as string[],
    status: ''
  };

  constructor(
    public dialogRef: MatDialogRef<EditStudent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.student = { ...data };
    }
  }

  onCancelar(): void {
    this.dialogRef.close();
  }

  onGuardar(): void {
    this.dialogRef.close(this.student);
  }
}
