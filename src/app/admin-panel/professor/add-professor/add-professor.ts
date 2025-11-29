import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-professor',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, FormsModule, MatInputModule],
  templateUrl: './add-professor.html',
  styleUrls: ['./add-professor.css'],
})
export class AddProfessor {
  readonly dialogRef = inject(MatDialogRef<AddProfessor>);
  readonly data = inject(MAT_DIALOG_DATA);

  newProfessor = { name: '', lastName: '', dni: '', file: '', email: '', academicTitle: '', phone: '', scheduleAvailability: '', status: 'Activo' };
  startTime: string = '';
  endTime: string = '';

  onCancelar(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.newProfessor.status = 'Activo';
    if (this.startTime && this.endTime) {
      this.newProfessor.scheduleAvailability = `${this.startTime} - ${this.endTime}`;
    }
    this.dialogRef.close(this.newProfessor);
  }
}
