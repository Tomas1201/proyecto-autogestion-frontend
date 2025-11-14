import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-add-career',
  imports: [MatDialogModule, MatIconModule, FormsModule, MatInputModule, MatSelectModule],
  templateUrl: './add-career.html',
  styleUrl: './add-career.css',
})
export class AddCareer {
  materiasDisponibles = [
    { id: 'M001', nombre: 'Algoritmos y Estructuras' },
    { id: 'M002', nombre: 'Bases de Datos I' },
    { id: 'M003', nombre: 'Programación Web' },
    { id: 'M004', nombre: 'Cálculo Avanzado' },
  ];

  newCareer = { name: '', description: '', duration: 0, materiasSeleccionadas: [] as string[] };

  constructor(
    public dialogRef: MatDialogRef<AddCareer>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancelar(): void {
    this.dialogRef.close();
  }

  onGuardar(): void {
    this.dialogRef.close(this.newCareer);
  }
}
