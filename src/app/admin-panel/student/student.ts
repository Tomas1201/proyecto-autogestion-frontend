import { Component,OnInit, ViewChild } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table'; 
import { MatSort, MatSortModule } from '@angular/material/sort'; 
import { MatIconModule } from '@angular/material/icon'; 
import { MatButtonModule } from '@angular/material/button'; 
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddStudent } from './add-student/add-student';

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
  MatDialogModule
  , AddStudent
  ],
  templateUrl: './student.html',
  styleUrl: './student.css',
})
export class StudentSelfManagement {
  constructor(private dialog: MatDialog) { }
  private studentData: Student[] = [
    {id: 1, name: 'Tomas', lastName: 'Gonzalez', career: 'Ing. Sistemas', status: 'Activo'},
    {id: 2, name: 'Maria', lastName: 'Lopez', career: 'Arquitectura', status: 'Inactivo'},
  
  ]
  displayedColumns: string[] = ['name', 'lastName', 'career', 'status', 'actions'];

  
  dataSource = new MatTableDataSource(this.studentData);
  
  
  @ViewChild(MatSort) sort!: MatSort; 

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  
 addStudent() {
     // Abre el diálogo para agregar una nueva carrera.
     const dialogRef = this.dialog.open(AddStudent, {
       minWidth: '300px',
       maxWidth: '600px',
       width: '90%'
     });
 
     dialogRef.afterClosed().subscribe(nuevaCarrera => {
       if (nuevaCarrera) {
         console.log('Carrera recibida:', nuevaCarrera);
         // Asumimos que nuevaCarrera cumple la interfaz Career. Ajustar si el dialog devuelve distinto shape.
         // Generar un id simple si no viene
         if (!('id' in nuevaCarrera) || nuevaCarrera.id == null) {
           const maxId = this.studentData.length ? Math.max(...this.studentData.map(c => c.id)) : 0;
           nuevaCarrera.id = maxId + 1;
         }
         this.studentData.push(nuevaCarrera as Student);
         this.dataSource.data = this.studentData;
       }
     });
   }

  editStudent(student: Student) {
    console.log('Editar:', student);
  }

  deleteStudent(id: number) {
    if(!confirm('¿Estás seguro de que deseas eliminar este alumno?')) {
      return;
    }
    this.studentData = this.studentData.filter(student => student.id !== id);
    this.dataSource.data = this.studentData;
    console.log(`Alumno eliminado con ID ${id} eliminada`);
    
  }
}
