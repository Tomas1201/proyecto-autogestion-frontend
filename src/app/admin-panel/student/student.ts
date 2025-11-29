import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddStudent } from './add-student/add-student';
import { BackConnection } from '../../back-connection.service';
import { EditStudent } from './edit-student/edit-student';
import { Observable } from 'rxjs';
import { AssignStudentSubject } from './assign-subject/assign-subject';

export interface StudentI {
  id: string;
  name: string;
  lastName: string;
  email: string;
  file: string;
  dni: string;
  career: string[];
  status: string;
}
interface StudentColumn {
  def: string;
  header: string;
  cellKey: string;
  sortable: boolean;
}



@Component({
  selector: 'app-student',
  imports: [
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatDialogModule,

  ],
  templateUrl: './student.html',
  styleUrl: './student.css',
})
export class Student implements OnInit {
  public students$: Observable<StudentI[]>;
  constructor(private dialog: MatDialog, private backConnection: BackConnection) {

    this.students$ = this.backConnection.students$;
  }

  private studentData: StudentI[] = [];

  public columns: StudentColumn[] = [
    { def: 'name', header: 'Nombre', cellKey: 'name', sortable: true },
    { def: 'lastName', header: 'Apellido', cellKey: 'lastName', sortable: true },
    { def: 'email', header: 'Email', cellKey: 'email', sortable: true },
    { def: 'file', header: 'Legajo', cellKey: 'file', sortable: true },
    { def: 'dni', header: 'DNI', cellKey: 'dni', sortable: true },
    { def: 'status', header: 'Estado', cellKey: 'status', sortable: true },

  ];


  public displayedColumns: string[] = this.columns.map(c => c.def).concat(['actions']);


  dataSource = new MatTableDataSource(this.studentData);

  @ViewChild(MatSort) sort!: MatSort;



  ngOnInit() {
    this.backConnection.loadStudents().subscribe({
      next: (data) => {
        console.log('Estudiantes cargados en el componente:', data);
        this.studentData = data;
        this.dataSource.data = this.studentData;
        if (this.sort) {
          this.dataSource.sort = this.sort;
        }
      },
      error: (err) => console.error('Fallo al cargar estudiantes', err)
    });
  }

  ngAfterViewInit() {

    this.dataSource.sort = this.sort;
  }

  public getCellValue(element: StudentI, cellKey: string): string {
    const key = cellKey as keyof StudentI;
    const value = element[key];

    // Lógica de formateo...
    if (cellKey === 'career' && Array.isArray(value)) {
      return value.join(', ');
    }

    return value !== null && value !== undefined ? String(value) : '';
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addStudent() {
    const dialogRef = this.dialog.open(AddStudent, {
      minWidth: '300px',
      maxWidth: '600px',
      width: '90%',
    });



    dialogRef.afterClosed().subscribe((newStudent) => {


      const careerArray: string[] = [];
      careerArray.push(newStudent.career);
      newStudent.career = careerArray;
      console.log('El diálogo se cerró. Datos recibidos:', newStudent);

      if (newStudent) {

        this.backConnection.createStudent(newStudent).subscribe({
          next: (response) => {
            console.log('Alumnos creada exitosamente. Respuesta:', response);

          },
          error: (err) => {
            console.error('Error al crear carrera mediante POST:', err);

          }
        });
      }
    });
  }

  editStudent(student: StudentI) {
    const dialogRef = this.dialog.open(EditStudent, {
      minWidth: '300px',
      maxWidth: '600px',
      width: '90%',
    });



    dialogRef.afterClosed().subscribe((updateStudent) => {
      const careerArray: string[] = [];
      careerArray.push(updateStudent.career);
      updateStudent.career = careerArray;
      console.log('Diálogo cerrado. Datos recibidos:', updateStudent);

      if (updateStudent) {

        this.backConnection.updateStudent(student.id, updateStudent).subscribe({
          next: (response) => {
            console.log(`Carrera ID ${updateStudent.id} actualizada con éxito:`, response);


          },
          error: (err) => {
            console.error('Error al actualizar alumno (PUT):', err);

          }
        });


      }
    });
  }

  assignSubject(student: StudentI) {
    const dialogRef = this.dialog.open(AssignStudentSubject, {
      minWidth: '300px',
      maxWidth: '600px',
      width: '90%',
      data: { studentId: student.id }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.backConnection.assignStudentToSubject(student.id, result).subscribe({
          next: (response) => {
            console.log('Asignación exitosa:', response);
            alert('Estudiante asignado correctamente');
          },
          error: (err) => {
            console.error('Error al asignar estudiante:', err);
            alert('Error al asignar estudiante: ' + (err.error?.error || 'Error desconocido'));
          }
        });
      }
    });
  }

  deleteStudent(id: string) {
    if (!confirm('¿Estás seguro de que deseas eliminar este alumno?')) {
      return;
    }
    this.studentData = this.studentData.filter((student) => student.id !== id);
    this.dataSource.data = this.studentData;
    console.log(`Alumno eliminado con ID ${id} eliminada`);
  }
}
