import { Component,OnInit, ViewChild } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table'; 
import { MatSort, MatSortModule } from '@angular/material/sort'; 
import { MatIconModule } from '@angular/material/icon'; 
import { MatButtonModule } from '@angular/material/button'; 
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input';


export interface Student {
  id: number; 
  nombre: string;
  apellido: string; 
  carrera: string;
  estado: string; 
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

  private alumnosData: Student[] = [
    {id: 1, nombre: 'Tomas', apellido: 'Gonzalez', carrera: 'Ing. Sistemas', estado: 'Activo'},
    {id: 2, nombre: 'Maria', apellido: 'Lopez', carrera: 'Arquitectura', estado: 'Inactivo'},
  
  ]
  displayedColumns: string[] = ['nombre', 'apellido', 'carrera', 'estado', 'acciones'];

  
  dataSource = new MatTableDataSource(this.alumnosData);
  
  
  @ViewChild(MatSort) sort!: MatSort; 

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

 
  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  
  agregarAlumno() {
    console.log('Abrir formulario para agregar');
  }

  editarAlumno(alumno: Student) {
    console.log('Editar:', alumno);
  }

  eliminarAlumno  (id: number) {
    if(!confirm('¿Estás seguro de que deseas eliminar este alumno?')) {
      return;
    }
    this.alumnosData = this.alumnosData.filter(alum => alum.id !== id);
    this.dataSource.data = this.alumnosData;
    console.log('Alumno eliminado con ID ${id} eliminada');
    
  }
}
