import { Component,OnInit, ViewChild } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table'; 
import { MatSort, MatSortModule } from '@angular/material/sort'; 
import { MatIconModule } from '@angular/material/icon'; 
import { MatButtonModule } from '@angular/material/button'; 
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

export interface Subject {
  id: number; 
  name: string;
  code: string; 
  classes: string;
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
  CommonModule],
  templateUrl: './subject.html',
  styleUrl: './subject.css',
})
export class SubjectSelfManagement {

  private subjectData: Subject[] = [
    {id: 1, name: 'Análisis Matemático 1', code: 'MAT101', classes: 'Ing. Sistemas'},
    {id: 2, name: 'Arquitectura de Computadoras', code: 'ARC202', classes: 'Arquitectura'},
  
  ]
  displayedColumns: string[] = ['name', 'code', 'classes', 'actions'];
  
  dataSource = new MatTableDataSource(this.subjectData);
  
  
  @ViewChild(MatSort) sort!: MatSort; 

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  
  addSubject() {
    console.log('Abrir formulario para agregar');
  }

  editSubject(subject: Subject) {
    console.log('Editar:', subject);
  }

  deleteSubject(id: number) {
    if(!confirm('¿Estás seguro de que deseas eliminar esta materia?')) {
      return;
    }
    this.subjectData = this.subjectData.filter(subject => subject.id !== id);
    this.dataSource.data = this.subjectData;
    console.log(`Materia eliminada con ID ${id} eliminada`);
    
  }
}
