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
import { BackConnection } from '../../back-connection.service';
import { CommonModule } from '@angular/common';
import { SubjectDisplayModal } from '../career/subject-display-modal/subject-display-modal'; 


export interface ConfiguredSubject {
    subjectId: string;
    name: string;
    year: number | null;
    correlativeId: string | null;
}

export interface Career {
  id: string;
  name: string;
  description: string;
  duration: number;
  subjects?: ConfiguredSubject[]; 
}

interface CareerColumn {
  def: string; 
  header: string; 
  cellKey: string;
  sortable: boolean; 
}

@Component({
  selector: 'app-career-self-management',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    CommonModule, 
  ],
  templateUrl: './career.html',
  styleUrls: ['./career.css'],
})
export class CareerComponent implements OnInit {
  constructor(private dialog: MatDialog, private backConnection: BackConnection) {}

  private careerData: Career[] = [];

  public columns: CareerColumn[] = [
    { def: 'name', header: 'Nombre', cellKey: 'name', sortable: true },
   
    { def: 'subjectsCount', header: 'Asignaturas', cellKey: 'subjectsCount', sortable: false }, 
    { def: 'description', header: 'Descripcion', cellKey: 'description', sortable: true },
    { def: 'duration', header: 'Duracion', cellKey: 'duration', sortable: true },
  ];

  
  public displayedColumns: string[] = this.columns.map(c => c.def).concat(['actions']);
  
  
  dataSource = new MatTableDataSource<Career & { subjectsCount: number }>([]);

  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
      this.loadCareers();
  }

  loadCareers() {
    this.backConnection.getCareer().subscribe({
      next: (data: Career[]) => {
        console.log('Datos de carreras recibidos:', data);
        
      
        const mappedData = data.map(career => ({
            ...career,
            subjectsCount: career.subjects ? career.subjects.length : 0 
        }));

        this.careerData = data; 
        this.dataSource.data = mappedData;
        
        if (this.sort) { 
          this.dataSource.sort = this.sort;
        }
      },
      error: (err) => {
        console.error('Error al cargar carreras desde el backend:', err);
      }
    });
  }

  
  showSubjects(career: Career): void {
    this.dialog.open(SubjectDisplayModal, {
        minWidth: '300px',
        maxWidth: '800px',
        width: '90%',
        data: {
            careerName: career.name,
            subjects: career.subjects || []
        }
    });
  }

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
            this.backConnection.createCareer(newCareer).subscribe({
                next: (response) => {
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
        data: career 
    });

    dialogRef.afterClosed().subscribe((updatedCareer) => {
        if (updatedCareer) {
            this.backConnection.updateCareer(career.id, updatedCareer).subscribe({
                next: (response) => {
                    this.loadCareers(); 
                },
                error: (err) => {
                    console.error('Error al actualizar carrera (PUT):', err);
                }
            });
        }
    });
  }

  deleteCareer(id: string) {
    
  }
}