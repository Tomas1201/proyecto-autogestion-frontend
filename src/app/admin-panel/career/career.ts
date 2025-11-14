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
  id: number;
  name: string;
  subjects: string;
  description: string;
  duration: number;
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
export class CareerSelfManagement implements OnInit {
  constructor(private dialog: MatDialog, private backConnection: BackConnection) {}

  private careerData: Career[] = [];

  displayedColumns: string[] = [
    'name',
    'subjects',
    'description',
    'duration',
    'actions',
  ];

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
    if (newCareer) {
      console.log('Nueva carrera recibida del diálogo:', newCareer);
      // LLAMADA AL SERVICIO CON EL MÉTODO POST (createCareer)
      this.backConnection.createCareer(newCareer).subscribe({
        next: (response) => {
          console.log('Carrera creada exitosamente. Respuesta:', response);
          this.loadCareers(); // Recargar la tabla para mostrar el nuevo registro del backend
        },
        error: (err) => {
          console.error('Error al crear carrera mediante POST:', err);
          // Manejo de errores (ej: si el nombre ya existe, etc.)
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
      data: { ...career },
    });



  dialogRef.afterClosed().subscribe((updatedCareer) => {
    if (updatedCareer) {
      // 1. LLAMADA AL SERVICIO: Usamos el ID y los datos actualizados
      this.backConnection.updateCareer(updatedCareer.id, updatedCareer).subscribe({
        next: (response) => {
          console.log(`Carrera ID ${updatedCareer.id} actualizada con éxito:`, response);
          // 2. Recargar los datos de la tabla para reflejar el cambio del backend
          this.loadCareers(); 
        },
        error: (err) => {
          console.error('Error al actualizar carrera (PUT):', err);
          // Opcional: Mostrar mensaje de error al usuario
        }
      });
      
      // La lógica local de actualización (findIndex, this.careerData[idx] = ...) se ELIMINA
    }
  });
}
  

  deleteCareer(id: number) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta carrera?')) return;

    this.careerData = this.careerData.filter((c) => c.id !== id);
    this.dataSource.data = [...this.careerData];
  }
}
