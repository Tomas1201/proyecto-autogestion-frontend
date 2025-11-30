import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ProfessorService } from '../../services/professor.service';
import { ProfessorSubject } from '../../shared/models/professor-subject.model';

@Component({
  selector: 'app-professor-exams',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
  ],
  template: `
    <div class="container">
      <h2>Exámenes Finales</h2>
      
      <mat-form-field appearance="outline" class="subject-select">
        <mat-label>Seleccionar Materia</mat-label>
        <mat-select [(ngModel)]="selectedSubjectId" (selectionChange)="onSubjectChange()">
          @for (subject of subjects(); track subject.id) {
            <mat-option [value]="subject.subjectId">{{ subject.subjectName }}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      @if (selectedSubjectId) {
        <div class="exams-list">
          <h3>Exámenes Programados</h3>
          @for (exam of exams(); track exam.id) {
            <mat-card class="exam-card" (click)="selectExam(exam)">
              <mat-card-header>
                <mat-card-title>Fecha: {{ exam.date | date }}</mat-card-title>
                <mat-card-subtitle>Aula: {{ exam.classroom }}</mat-card-subtitle>
              </mat-card-header>
            </mat-card>
          }
          @if (exams().length === 0) {
            <p>No hay exámenes programados para esta materia.</p>
          }
        </div>
      }

      @if (selectedExam) {
        <h3>Alumnos Inscriptos al Examen</h3>
        <table mat-table [dataSource]="registrations()" class="mat-elevation-z8">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef> Alumno </th>
            <td mat-cell *matCellDef="let element"> {{element.studentLastName}}, {{element.studentName}} </td>
          </ng-container>

          <ng-container matColumnDef="dni">
            <th mat-header-cell *matHeaderCellDef> DNI </th>
            <td mat-cell *matCellDef="let element"> {{element.studentDni}} </td>
          </ng-container>

          <ng-container matColumnDef="grade">
            <th mat-header-cell *matHeaderCellDef> Nota </th>
            <td mat-cell *matCellDef="let element">
              <mat-form-field appearance="outline" class="dense-input">
                <input matInput type="number" min="1" max="10" [(ngModel)]="element.grade" (change)="updateGrade(element)">
              </mat-form-field>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef> Estado </th>
            <td mat-cell *matCellDef="let element"> {{ element.status }} </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      }
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .subject-select { width: 100%; max-width: 400px; margin-bottom: 20px; }
    .exams-list { margin-bottom: 30px; }
    .exam-card { margin-bottom: 10px; cursor: pointer; transition: background 0.3s; }
    .exam-card:hover { background-color: #f5f5f5; }
    table { width: 100%; }
    .dense-input { width: 80px; font-size: 14px; }
    ::ng-deep .dense-input .mat-mdc-form-field-subscript-wrapper { display: none; }
  `]
})
export class ProfessorExams implements OnInit {
  private professorService = inject(ProfessorService);
  
  subjects = signal<ProfessorSubject[]>([]);
  exams = signal<any[]>([]);
  registrations = signal<any[]>([]);
  
  selectedSubjectId = '';
  selectedExam: any = null;
  
  displayedColumns = ['name', 'dni', 'grade', 'status'];

  ngOnInit() {
    this.professorService.getProfessorSubjects().subscribe(s => this.subjects.set(s));
  }

  onSubjectChange() {
    if (this.selectedSubjectId) {
      this.selectedExam = null;
      this.registrations.set([]);
      this.professorService.getFinalExams(this.selectedSubjectId).subscribe(e => this.exams.set(e));
    }
  }

  selectExam(exam: any) {
    this.selectedExam = exam;
    this.professorService.getExamRegistrations(exam.id).subscribe(r => this.registrations.set(r));
  }

  updateGrade(registration: any) {
    const newStatus = registration.grade >= 4 ? 'PASSED' : 'FAILED';
    registration.status = newStatus; 
    this.professorService.updateExamGrade(registration.id, registration.grade, newStatus).subscribe({
      next: () => console.log('Grade updated'),
      error: (err) => alert('Error updating grade: ' + err.message)
    });
  }
}
