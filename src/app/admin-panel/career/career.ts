import { Component, OnInit, ViewChild } from '@angular/core'; 
import { MatTableModule, MatTableDataSource } from '@angular/material/table'; 
import { MatSort, MatSortModule } from '@angular/material/sort'; 
import { MatIconModule } from '@angular/material/icon'; 
import { MatButtonModule } from '@angular/material/button'; 
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddCareer } from './add-career/add-career';

export interface Career {
  id: number; 
  name: string;
  subjects: string; 
  description: string;
  duration: number; 
}



@Component({
  selector: 'app-career-self-management',
  imports: [
    MatTableModule, // Eliminada la duplicación
    MatSortModule,       
    MatButtonModule,     
    MatIconModule,       
    MatFormFieldModule,  
    MatInputModule,
    MatDialogModule
  ],
  templateUrl: './career.html',
  styleUrls: ['./career.css'],
})
export class CareerSelfManagement implements OnInit {
  constructor(private dialog: MatDialog) { }
  

  // 1. Datos iniciales como propiedad mutable de la clase
  private careerData: Career[] = [
    {id: 1, name: 'Ing. Sistemas', subjects: 'Ver Materias', description: 'Análisis y desarrollo de software', duration: 5},
    {id: 2, name: 'Arquitectura', subjects: 'Ver Materias', description: 'Diseño y construcción de espacios', duration: 4},
    // Puedes añadir más datos aquí
  ];
  
  displayedColumns: string[] = ['name', 'subjects', 'description', 'duration', 'actions'];

  // 2. dataSource se inicializa con la propiedad mutable
  dataSource = new MatTableDataSource(this.careerData);
  
  @ViewChild(MatSort) sort!: MatSort; 

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  addCareer() {
    // Abre el diálogo para agregar una nueva carrera.
    const dialogRef = this.dialog.open(AddCareer, {
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
          const maxId = this.careerData.length ? Math.max(...this.careerData.map(c => c.id)) : 0;
          nuevaCarrera.id = maxId + 1;
        }
        this.careerData.push(nuevaCarrera as Career);
        this.dataSource.data = this.careerData;
      }
    });
  }

  editCareer(career: Career) {
    console.log('Editar:', career);
    // Lógica pendiente: Abrir modal de edición pre-rellenado
  }

  /**
   * Elimina una carrera del arreglo y refresca la tabla.
   * @param id El ID de la carrera a eliminar.
   */
  deleteCareer(id: number) {
     
    // Lógica real de eliminación (puedes añadir la confirmación aquí)
    if (!confirm('¿Estás seguro de que deseas eliminar esta carrera?')) {
      return; // Detiene la función si el usuario cancela
    }
    
    // 1. Filtrar el arreglo original (quitar el elemento)
    this.careerData = this.careerData.filter(career => career.id !== id);

    // 2. Refrescar la tabla asignando el nuevo arreglo de vuelta al dataSource
    this.dataSource.data = this.careerData;
    
    console.log(`Carrera con ID ${id} eliminada.`);
  }
}
    
  

