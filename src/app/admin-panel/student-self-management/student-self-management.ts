import { Component,OnInit, ViewChild } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table'; 
import { MatSort, MatSortModule } from '@angular/material/sort'; 
import { MatIconModule } from '@angular/material/icon'; 
import { MatButtonModule } from '@angular/material/button'; 
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input';


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
    MatInputModule],
  templateUrl: './student-self-management.html',
  styleUrl: './student-self-management.css',
})
export class StudentSelfManagement {

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
    console.log('Abrir formulario para agregar');
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
