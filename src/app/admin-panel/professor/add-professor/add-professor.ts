import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { defineInjectable } from '@angular/core/primitives/di';

@Component({
  selector: 'app-add-professor',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, FormsModule, MatInputModule],
  templateUrl: './add-professor.html',
  styleUrls: ['./add-professor.css'],
})
export class AddProfessor {
  newProfessor = { name: '', lastName: '', dni: '', file: '', academicTitle: '', email: '', phone: '', scheduleAvailability: '', status: 'Activo' };

  constructor(
    public dialogRef: MatDialogRef<AddProfessor>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancelar(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.newProfessor.status = 'Activo';
    this.dialogRef.close(this.newProfessor);
  }
}
