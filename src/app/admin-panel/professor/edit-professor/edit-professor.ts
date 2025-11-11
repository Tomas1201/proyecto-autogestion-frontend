import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-professor',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, FormsModule, MatInputModule, MatSelectModule],
  templateUrl: './edit-professor.html',
  styleUrls: ['./edit-professor.css'],
})
export class EditProfessor {
  // Lista de estados disponibles
  status = ['Activo', 'Inactivo'];

  // Recibe los datos del profesor desde el componente padre
  editProfessor = { name: '', lastName: '', career: '', status: '' };

  constructor(
    public dialogRef: MatDialogRef<EditProfessor>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Carga los datos recibidos en el formulario
    if (data) {
      this.editProfessor = { ...data };
    }
  }

  onCancelar(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    // Devuelve el profesor editado al componente padre
    this.dialogRef.close(this.editProfessor);
  }
}
