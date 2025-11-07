import { Component, OnInit, ViewChild } from '@angular/core'; 
import { MatTableModule, MatTableDataSource } from '@angular/material/table'; 
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



@Component({
  selector: 'app-career-self-management',
  imports: [
    MatTableModule, // Eliminada la duplicación
    MatSortModule,       
    MatButtonModule,     
    MatIconModule,       
    MatFormFieldModule,  
    MatInputModule
  ],
  templateUrl: './professor-self-management.html',
  styleUrl: './professor-self-management.css',
})
export class ProfessorSelfManagement implements OnInit {
  
  private profesoresData: Professor[] = [
    {id: 1, nombre: 'Juan', apellido: 'Pérez', carrera: 'Ing. Sistemas', estado: 'Activo'},
    {id: 2, nombre: 'María', apellido: 'Gómez', carrera: 'Arquitectura', estado: 'Inactivo'},
    // Puedes añadir más datos aquí
  ];
  displayedColumns: string[] = ['nombre', 'apellido', 'carrera', 'estado', 'acciones'];

  dataSource = new MatTableDataSource(this.profesoresData);
  
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
    if(!confirm('¿Estás seguro de que deseas eliminar este profesor?')) {
      return;
    }

    this.profesoresData = this.profesoresData.filter(prof => prof.id !== id);
    this.dataSource.data = this.profesoresData;
    console.log('Profesor eliminado con ID ${id} eliminada');
    
  }
}
