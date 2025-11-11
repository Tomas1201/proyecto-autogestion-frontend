import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-add-student',
  imports: [ MatDialogModule, MatIconModule, FormsModule, MatInputModule, MatSelectModule ],
  templateUrl: './add-student.html',
  styleUrl: './add-student.css',
})
export class AddStudent {
 studentsDisponibles = [
    { id: 'M001', nombre: 'Algoritmos y Estructuras' },
    { id: 'M002', nombre: 'Bases de Datos I' },
    { id: 'M003', nombre: 'Programación Web' },
    { id: 'M004', nombre: 'Cálculo Avanzado' }
  ];
 
  newStudent = { Name: '', lastName:'',carrera: 0 , state: [] as string[]}; // Modelo de datos

  // 1. Inyecta MatDialogRef para poder controlar el cierre del modal
  constructor(public dialogRef: MatDialogRef<AddStudent>, @Inject(MAT_DIALOG_DATA) public data: any) { } 

  // Función para cerrar (Cancelar)
  onCancelar(): void {
    this.dialogRef.close(); // Cierra sin retornar datos
  }

  // Función para guardar (Aceptar)
  onGuardar(): void {
    // 2. Cierra y retorna el objeto 'nuevaCarrera' al componente padre
    this.dialogRef.close(this.newStudent); 
  }
}
