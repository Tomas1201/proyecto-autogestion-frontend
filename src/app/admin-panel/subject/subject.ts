// subject.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { EditSubjectComponent } from './edit-subject/edit-subject';
import { AddSubjectComponent } from './add-subject/add-subject';
import {BackConnection} from '../../back-connection.service';

export interface Subject {
  id: number;
  name: string;
  code: string;
  hours: number; 
  horarioid: number; 
  classroom: string; 
}

interface SubjectColumn {
  def: string;      
  header: string;   
  cellKey: string;  
  sortable: boolean; 
}
@Component({
  selector: 'app-subject-self-management',
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
  templateUrl: './subject.html',
  styleUrls: ['./subject.css'],
})
export class Subject implements OnInit {
  private subjectData: Subject[] = [];

 public columns: SubjectColumn[] = [
  { def: 'name', header: 'Nombre', cellKey: 'name', sortable: true },
  { def: 'code', header: 'Codigo', cellKey: 'code', sortable: true },
  { def: 'hours', header: 'Horas', cellKey: 'hours', sortable: true },
  { def: 'classroom', header: 'Aula', cellKey: 'classroom', sortable: true },
  

];


public displayedColumns: string[] = this.columns.map(c => c.def).concat(['actions']);

  dataSource = new MatTableDataSource(this.subjectData);

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private backConnection: BackConnection) {}

 ngOnInit() {
        this.loadSubjets();
     }
     loadSubjets() {
     this.backConnection.getSubjects().subscribe({
       next: (data: Subject[]) => {
         console.log('Datos de materias recibidos:', data);
         this.subjectData = data; 
         this.dataSource.data = this.subjectData; 
         if (this.sort) { 
           this.dataSource.sort = this.sort;
         }
         console.log('Datos de materias cargados desde el backend.');
       },
       error: (err) => {
         console.error('Error al cargar materias desde el backend:', err);
         
       }
     });}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  addSubject() {
    const dialogRef = this.dialog.open(AddSubjectComponent, {
      width: '420px',
      maxWidth: '95%',
      disableClose: true,
      data: {},
    });

    dialogRef.afterClosed().subscribe((newSubject) => {
    console.log('Diálogo cerrado. Datos recibidos:', newSubject);
    if (newSubject) {
      console.log('Nueva carrera recibida del diálogo:', newSubject);
      
      this.backConnection.createSubject(newSubject).subscribe({
        next: (response) => {
          console.log('Carrera creada exitosamente. Respuesta:', response);
          this.loadSubjets(); 
        },
        error: (err) => {
          console.error('Error al crear carrera mediante POST:', err);
          
        }
      });
    }
  });
}
  
  

  editSubject(subject: Subject) {
    const dialogRef = this.dialog.open(EditSubjectComponent, {
      width: '420px',
      maxWidth: '95%',
      disableClose: true,
      data: subject,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const index = this.subjectData.findIndex((s) => s.id === subject.id);
        if (index !== -1) {
          this.subjectData[index] = { ...this.subjectData[index], ...result };
          this.dataSource.data = [...this.subjectData];
        }
      }
    });
  }

  deleteSubject(id: number) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta materia?')) {
      return;
    }
    this.subjectData = this.subjectData.filter((subject) => subject.id !== id);
    this.dataSource.data = [...this.subjectData];
    console.log(`Materia eliminada con ID ${id}`);
  }
}
