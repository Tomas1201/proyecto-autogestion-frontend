import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import {  OnInit, ViewChild } from '@angular/core'; 
import {  MatTableDataSource } from '@angular/material/table'; 
import { MatSort, MatSortModule } from '@angular/material/sort'; 
import { MatIconModule } from '@angular/material/icon'; 
import { MatButtonModule } from '@angular/material/button'; 
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input';


export interface Professor {
  id: number; 
  nombre: string;
  apellido: string; 
  carrera: string;
  estado: string; 
}

const DATOS_PROFESORES: Professor[] = [
  {id: 1, nombre: 'Ivo', apellido: 'Davobe', carrera: 'Ing. Sistemas', estado: 'Activo'},
  {id: 2, nombre: 'Carlos', apellido: 'Sanchez', carrera: 'Ing. Sistemas', estado: 'Inactivo'},
  
];

@Component({
  selector: 'app-career-self-management',
  imports: [MatTableModule, 
    MatTableModule,
    MatSortModule,       
    MatButtonModule,     
    MatIconModule,       
    MatFormFieldModule,  
    MatInputModule],
  templateUrl: './professor-self-management.html',
  styleUrl: './professor-self-management.css',
})
export class ProfessorSelfManagement {
  displayedColumns: string[] = ['nombre', 'apellido', 'carrera', 'estado', 'acciones'];


  dataSource = new MatTableDataSource(DATOS_PROFESORES);


  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

 
  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  
  agregarProfesor() {
    console.log('Abrir formulario para agregar');
  }

  editarProfesor(profesor: Professor) {
    console.log('Editar:', profesor);
  }

  eliminarProfesor(id: number) {
    console.log('Eliminar ID:', id);
    
  }
}
