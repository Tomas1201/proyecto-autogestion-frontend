import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddCareer } from './add-career/add-career';
import { EditCareer } from './edit-career/edit-career';
import {BackConnection} from '../../back-connection.service';

export interface Career {
  id: string;
  name: string;
  //subjects: string;
  description: string;
  duration: number;
 
}

interface CareerColumn {
  def: string;      
  header: string;   
  cellKey: string;  
  sortable: boolean; 
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
    MatDialogModule,
  ],
  templateUrl: './career.html',
  styleUrls: ['./career.css'],
})
export class Career implements OnInit {
  constructor(private dialog: MatDialog, private backConnection: BackConnection) {}

  private careerData: Career[] = [];

public columns: CareerColumn[] = [
  { def: 'name', header: 'Nombre', cellKey: 'name', sortable: true },
  { def: 'subject', header: 'Asignatura', cellKey: 'subject', sortable: true },
  { def: 'description', header: 'Descripcion', cellKey: 'description', sortable: true },
  { def: 'duration', header: 'Duracion', cellKey: 'duration', sortable: true },
];

  public displayedColumns: string[] = this.columns.map(c => c.def).concat(['actions']);
 

  dataSource = new MatTableDataSource(this.careerData);

  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
     this.loadCareers();
  }
  
  loadCareers() {
  this.backConnection.getCareer().subscribe({
    next: (data: Career[]) => {
      console.log('Datos de carreras recibidos:', data);
      this.careerData = data; // Almacena los datos
      this.dataSource.data = this.careerData; // Asigna al MatTableDataSource
      
      // Asigna el sort después de cargar los datos
      if (this.sort) { 
        this.dataSource.sort = this.sort;
      }
      console.log('Datos de carreras cargados desde el backend.');
    },
    error: (err) => {
      console.error('Error al cargar carreras desde el backend:', err);
      // Opcional: Mostrar un mensaje al usuario (ej: un snackbar)
    }
  });}

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  addCareer() {
    const dialogRef = this.dialog.open(AddCareer, {
      minWidth: '300px',
      maxWidth: '600px',
      width: '90%',
    });

 

  dialogRef.afterClosed().subscribe((newCareer) => {
    console.log('Diálogo cerrado. Datos recibidos:', newCareer);
    if (newCareer) {
      console.log('Nueva carrera recibida del diálogo:', newCareer);
      
      this.backConnection.createCareer(newCareer).subscribe({
        next: (response) => {
          console.log('Carrera creada exitosamente. Respuesta:', response);
          this.loadCareers(); 
        },
        error: (err) => {
          console.error('Error al crear carrera mediante POST:', err);
          
        }
      });
    }
  });
}

  editCareer(career: Career) {
    const dialogRef = this.dialog.open(EditCareer, {
      minWidth: '300px',
      maxWidth: '600px',
      width: '90%',
    });



  dialogRef.afterClosed().subscribe((updatedCareer) => {
    if (updatedCareer) {
      
      this.backConnection.updateCareer(career.id, updatedCareer).subscribe({
        next: (response) => {
          console.log(`Carrera ID ${updatedCareer.id} actualizada con éxito:`, response);
      
          this.loadCareers(); 
        },
        error: (err) => {
          console.error('Error al actualizar carrera (PUT):', err);
      
        }
      });
      
      
    }
  });
}
  

  deleteCareer(id: number) {
   /* if (!confirm('¿Estás seguro de que deseas eliminar esta carrera?')) return;

    this.careerData = this.careerData.filter((c) => c.id !== id);
    this.dataSource.data = [...this.careerData]; */
  }
    
}
