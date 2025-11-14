import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddStudent } from './add-student/add-student';
import {BackConnection} from '../../back-connection.service';

export interface Student {
  id: number;
  name: string;
  lastName: string;
  career: string;
  status: string;
}

@Component({
  selector: 'app-career-self-management',
  imports: [
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatDialogModule,
    AddStudent,
  ],
  templateUrl: './student.html',
  styleUrl: './student.css',
})
export class StudentSelfManagement {
  constructor(private dialog: MatDialog, private backConnection: BackConnection) {}

  private studentData: Student[] = [];
  displayedColumns: string[] = ['name', 'lastName', 'career', 'status', 'actions'];

  dataSource = new MatTableDataSource(this.studentData);

  @ViewChild(MatSort) sort!: MatSort;

  

  ngOnInit() {
       this.loadStudents();
    }
    loadStudents() {
    this.backConnection.getStudents().subscribe({
      next: (data: Student[]) => {
        console.log('Datos de carreras recibidos:', data);
        this.studentData = data; 
        this.dataSource.data = this.studentData; 
        if (this.sort) { 
          this.dataSource.sort = this.sort;
        }
        console.log('Datos de estudiantes cargados desde el backend.');
      },
      error: (err) => {
        console.error('Error al cargar de estudentes desde el backend:', err);
        
      }
    });}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addCareer() {
      const dialogRef = this.dialog.open(AddStudent, {
        minWidth: '300px',
        maxWidth: '600px',
        width: '90%',
      });
  
   
  
    dialogRef.afterClosed().subscribe((newStudent) => {
      if (newStudent) {
        console.log('Nueva carrera recibida del diálogo:', newStudent);
        // LLAMADA AL SERVICIO CON EL MÉTODO POST (createCareer)
        this.backConnection.createStudent(newStudent).subscribe({
          next: (response) => {
            console.log('Carrera creada exitosamente. Respuesta:', response);
            this.loadStudents(); // Recargar la tabla para mostrar el nuevo registro del backend
          },
          error: (err) => {
            console.error('Error al crear carrera mediante POST:', err);
            // Manejo de errores (ej: si el nombre ya existe, etc.)
          }
        });
      }
    });
  }

  editStudent(student: Student) {
    console.log('Editar:', student);
  }

  deleteStudent(id: number) {
    if (!confirm('¿Estás seguro de que deseas eliminar este alumno?')) {
      return;
    }
    this.studentData = this.studentData.filter((student) => student.id !== id);
    this.dataSource.data = this.studentData;
    console.log(`Alumno eliminado con ID ${id} eliminada`);
  }
}
