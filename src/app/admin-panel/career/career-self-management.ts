import { Component, OnInit, ViewChild } from '@angular/core'; 
import { MatTableModule, MatTableDataSource } from '@angular/material/table'; 
import { MatSort, MatSortModule } from '@angular/material/sort'; 
import { MatIconModule } from '@angular/material/icon'; 
import { MatButtonModule } from '@angular/material/button'; 
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { AddCareer } from './add-career/add-career';

export interface Carrera {
  id: number; 
  nombre: string;
  materias: string; 
  descripcion: string;
  duracion: number; 
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
  templateUrl: './career-self-management.html',
  styleUrl: './career-self-management.css',
})
export class CareerSelfManagement implements OnInit {
  constructor(private dialog: MatDialog) { }
  

  // 1. Datos iniciales como propiedad mutable de la clase
  private carrerasData: Carrera[] = [
    {id: 1, nombre: 'Ing. Sistemas', materias: 'Ver Materias', descripcion: 'Análisis y desarrollo de software', duracion: 5},
    {id: 2, nombre: 'Arquitectura', materias: 'Ver Materias', descripcion: 'Diseño y construcción de espacios', duracion: 4},
    // Puedes añadir más datos aquí
  ];
  
  displayedColumns: string[] = ['nombre', 'materias', 'descripcion', 'duracion', 'acciones'];

  // 2. dataSource se inicializa con la propiedad mutable
  dataSource = new MatTableDataSource(this.carrerasData);
  
  @ViewChild(MatSort) sort!: MatSort; 

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  agregarCarrera() {
  const dialogRef = this.dialog.open(AddCareer, {
     minWidth: '300px', 
    maxWidth: '600px', // Limita el ancho máximo en pantallas grandes
    width: '90%',
    });
    dialogRef.afterClosed().subscribe(nuevaCarrera => {
      if (nuevaCarrera) {
        console.log('Carrera recibida:', nuevaCarrera);
        // Aquí puedes procesar/guardar la nueva carrera
      }
    });
  }

  editarCarrera(carrera: Carrera) {
    console.log('Editar:', carrera);
    // Lógica pendiente: Abrir modal de edición pre-rellenado
  }

  /**
   * Elimina una carrera del arreglo y refresca la tabla.
   * @param id El ID de la carrera a eliminar.
   */
  eliminarCarrera(id: number) {
     
    // Lógica real de eliminación (puedes añadir la confirmación aquí)
    if (!confirm('¿Estás seguro de que deseas eliminar esta carrera?')) {
      return; // Detiene la función si el usuario cancela
    }
    
    // 1. Filtrar el arreglo original (quitar el elemento)
    this.carrerasData = this.carrerasData.filter(carrera => carrera.id !== id);

    // 2. Refrescar la tabla asignando el nuevo arreglo de vuelta al dataSource
    this.dataSource.data = this.carrerasData;
    
    console.log(`Carrera con ID ${id} eliminada.`);
  }
}
    
  

