import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { AddProfessor } from './add-professor/add-professor';
import { EditProfessor } from './edit-professor/edit-professor';
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
  ],
  templateUrl: './professor.html',
  styleUrls: ['./professor.css'],
})
export class Professor implements OnInit {
  private dialog = inject(MatDialog);
  private backConnection = inject(BackConnection);

  private professorData: Professor[] = [];

  displayedColumns: string[] = [
    'name',
    'lastName',
    'dni',
    'file',
    'academicTitle',
    'email',
    'phone',
    'scheduleAvailability',
    'state',
    'actions'
  ];

  dataSource = new MatTableDataSource(this.professorData);

  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.loadProfessors();
  }

  loadProfessors() {
    this.backConnection.getProfessor().subscribe({
      next: (data: Professor[]) => {
        console.log('Datos de profesores recibidos:', data);
        this.professorData = data;
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
        const newId = this.professorData.length
          ? Math.max(...this.professorData.map((p) => p.id)) + 1
          : 1;
        this.professorData.push({ id: newId, ...result });
        this.dataSource.data = [...this.professorData];
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

  deleteProfessor(id: number) {
    if (!confirm('¿Estás seguro de que deseas eliminar este profesor?')) {
      return;
    }
    this.professorData = this.professorData.filter((p) => p.id !== id);
    this.dataSource.data = [...this.professorData];
  }
}
