import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddProfessor } from './add-professor/add-professor';
import { EditProfessor } from './edit-professor/edit-professor';
import { AssignSubject } from './assign-subject/assign-subject';
import { BackConnection } from '../../back-connection.service';

export interface Professor {
  id: number;
  name: string;
  lastName: string;
  dni: string;
  file: string;
  academicTitle: string;
  email: string;
  phone: string;
  scheduleAvailability: string;
  state: string;
}
interface ProfessorColumn {
  def: string;
  header: string;
  cellKey: string;
  sortable: boolean;
}

@Component({
  selector: 'app-professor-self-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './professor.html',
  styleUrls: ['./professor.css'],
})
export class Professor implements OnInit {
  private dialog = inject(MatDialog);
  private backConnection = inject(BackConnection);

  private professorData: Professor[] = [];


  dataSource = new MatTableDataSource(this.professorData);

  public columns: ProfessorColumn[] = [
    { def: 'name', header: 'Nombre', cellKey: 'name', sortable: true },
    { def: 'lastName', header: 'Apellido', cellKey: 'lastName', sortable: true },
    { def: 'phone', header: 'Telefono', cellKey: 'phone', sortable: true },
    { def: 'scheduleAvailability', header: 'Disponibilidad', cellKey: 'scheduleAvailability', sortable: true },
    { def: 'academicTitle', header: 'Titulo', cellKey: 'academicTitle', sortable: true },
    { def: 'email', header: 'Email', cellKey: 'email', sortable: true },
    { def: 'file', header: 'Legajo', cellKey: 'file', sortable: true },
    { def: 'dni', header: 'DNI', cellKey: 'dni', sortable: true },
    { def: 'state', header: 'Estado', cellKey: 'state', sortable: true },

  ];


  public displayedColumns: string[] = this.columns.map(c => c.def).concat(['actions']);


  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.loadProfessors();
  }

  loadProfessors() {
    this.backConnection.getProfessor().subscribe({
      next: (data: any) => {
        console.log('Datos de profesores recibidos:', data);
        this.professorData = data.data;
        console.log('Datos de profesores cargados:', this.professorData);
        this.dataSource.data = this.professorData;
        if (this.sort) {
          this.dataSource.sort = this.sort;
        }
        console.log('Datos de profesores cargados desde el backend.');
      },
      error: (err) => {
        console.error('Error al cargar profesores desde el backend:', err);
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addProfessor() {
    const dialogRef = this.dialog.open(AddProfessor, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.backConnection.createProfessor(result).subscribe({
          next: (response) => {
            console.log('Profesor creado exitosamente. Respuesta:', response);
            this.loadProfessors();
          },
          error: (err) => {
            console.error('Error al crear profesor mediante POST:', err);

          }
        });

      }
    });
  }

  editProfessor(professor: Professor) {
    const dialogRef = this.dialog.open(EditProfessor, {
      width: '400px',
      data: { ...professor },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const index = this.professorData.findIndex((p) => p.id === professor.id);
        if (index !== -1) {
          this.professorData[index] = { ...result, id: professor.id };
          this.dataSource.data = [...this.professorData];
        }
      }
    });
  }

  assignSubject(professor: Professor) {
    const dialogRef = this.dialog.open(AssignSubject, {
      width: '400px',
      data: { professorId: professor.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.backConnection.assignProfessorToSubject(professor.id.toString(), result).subscribe({
          next: (response) => {
            console.log('Materia asignada exitosamente:', response);
            alert('Materia asignada exitosamente');
          },
          error: (err) => {
            console.error('Error al asignar materia:', err);
            alert('Error al asignar materia: ' + (err.error?.message || err.message));
          }
        });
      }
    });
  }

  deleteProfessor(id: number) {
    if (!confirm('¿Estás seguro de que deseas eliminar este profesor?')) {
      return;
    }
    this.professorData = this.professorData.filter((p) => p.id !== id);
    this.dataSource.data = [...this.professorData];
  }
}
