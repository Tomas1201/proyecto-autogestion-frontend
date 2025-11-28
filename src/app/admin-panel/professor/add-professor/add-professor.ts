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

  newProfessor = { name: '', lastName: '', dni: '', file: '', academicTitle: '', email: '', phone: '', scheduleAvailability: '', status: 'Activo' };

  onCancelar(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.newProfessor.status = 'Activo';
    this.dialogRef.close(this.newProfessor);
  }
}
