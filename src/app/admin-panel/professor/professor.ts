import { Component, OnInit, ViewChild } from '@angular/core'; 
import { MatTableModule, MatTableDataSource } from '@angular/material/table'; 
import { MatSort, MatSortModule } from '@angular/material/sort'; 
import { MatIconModule } from '@angular/material/icon'; 
import { MatButtonModule } from '@angular/material/button'; 
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

export interface Professor {
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
    CommonModule
  ],
  templateUrl: './professor.html',
  styleUrl: './professor.css',
})
export class ProfessorSelfManagement implements OnInit {
  
  private professorData: Professor[] = [
    {id: 1, name: 'Juan', lastName: 'Pérez', career: 'Ing. Sistemas', status: 'Activo'},
    {id: 2, name: 'María', lastName: 'Gómez', career: 'Arquitectura', status: 'Inactivo'},
    // Puedes añadir más datos aquí
  ];
  displayedColumns: string[] = ['nombre', 'apellido', 'carrera', 'estado', 'acciones'];

  dataSource = new MatTableDataSource(this.professorData);
  
  @ViewChild(MatSort) sort!: MatSort;
 

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

 
  aplyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  
  addProfessor() {
    console.log('Abrir formulario para agregar');
  }

  editProfessor(profesor: Professor) {
    console.log('Editar:', profesor);
  }

  
  deleteProfessor(id: number) {
    if(!confirm('¿Estás seguro de que deseas eliminar este profesor?')) {
      return;
    }

    this.professorData = this.professorData.filter(prof => prof.id !== id);
    this.dataSource.data = this.professorData;
    console.log(`Profesor eliminado con ID ${id} eliminada`);
    
  }
}
