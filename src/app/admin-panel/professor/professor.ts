import { Component, OnInit, ViewChild } from '@angular/core';
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

export interface Professor {
  id: number;
  name: string;
  lastName: string;
  career: string;
  status: string;
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
export class ProfessorSelfManagement implements OnInit {
  private professorData: Professor[] = [
    {
      id: 1,
      name: 'Carlos',
      lastName: 'Pérez',
      career: 'Ingeniería en Sistemas',
      status: 'Activo',
    },
    { id: 2, name: 'Laura', lastName: 'Gómez', career: 'Arquitectura', status: 'Inactivo' },
  ];

  displayedColumns: string[] = ['name', 'lastName', 'career', 'status', 'actions'];
  dataSource = new MatTableDataSource(this.professorData);

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.dataSource.sort = this.sort;
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
