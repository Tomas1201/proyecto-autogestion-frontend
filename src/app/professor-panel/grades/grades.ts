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
  selector: 'app-professor-grades',
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
      <h2>Cargar Notas (Gestión de Estado)</h2>
      
      <mat-form-field appearance="outline" class="subject-select">
        <mat-label>Seleccionar Materia</mat-label>
        <mat-select [(ngModel)]="selectedSubjectId" (selectionChange)="onSubjectChange()">
          @for (subject of subjects(); track subject.id) {
            <mat-option [value]="subject.subjectId">{{ subject.subjectName }}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      @if (selectedSubjectId) {
        <table mat-table [dataSource]="students()" class="mat-elevation-z8">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef> Alumno </th>
            <td mat-cell *matCellDef="let element"> {{element.lastName}}, {{element.name}} </td>
          </ng-container>

          <ng-container matColumnDef="dni">
            <th mat-header-cell *matHeaderCellDef> DNI </th>
            <td mat-cell *matCellDef="let element"> {{element.dni}} </td>
          </ng-container>

          <ng-container matColumnDef="grade">
            <th mat-header-cell *matHeaderCellDef> Nota </th>
            <td mat-cell *matCellDef="let element">
              <mat-form-field appearance="outline" class="dense-input">
                <input matInput type="number" min="1" max="10" [(ngModel)]="element.grade" (change)="updateStatus(element, element.status)">
              </mat-form-field>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef> Estado </th>
            <td mat-cell *matCellDef="let element">
              <mat-form-field appearance="outline" class="dense-select">
                <mat-select [value]="element.status" (selectionChange)="updateStatus(element, $event.value)">
                  <mat-option value="ENROLLED">Cursando</mat-option>
                  <mat-option value="PASSED">Aprobado</mat-option>
                  <mat-option value="FAILED">Desaprobado</mat-option>
                </mat-select>
              </mat-form-field>
            </td>
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
    table { width: 100%; }
    .dense-select { width: 150px; font-size: 14px; }
    .dense-input { width: 80px; font-size: 14px; }
    ::ng-deep .dense-select .mat-mdc-form-field-subscript-wrapper,
    ::ng-deep .dense-input .mat-mdc-form-field-subscript-wrapper { display: none; }
  `]
})
export class ProfessorGrades implements OnInit {
  private professorService = inject(ProfessorService);
  
  subjects = signal<ProfessorSubject[]>([]);
  students = signal<any[]>([]);
  selectedSubjectId = '';
  displayedColumns = ['name', 'dni', 'grade', 'status'];

  ngOnInit() {
    this.professorService.getProfessorSubjects().subscribe(s => this.subjects.set(s));
  }

  onSubjectChange() {
    if (this.selectedSubjectId) {
      this.professorService.getStudentsBySubject(this.selectedSubjectId).subscribe(s => this.students.set(s));
    }
  }

  updateStatus(student: any, newStatus: string) {
    student.status = newStatus; // Optimistic update
    this.professorService.updateStudentStatus(student.registrationId, newStatus, student.grade).subscribe({
      next: () => console.log(`Updated ${student.name}: Status=${newStatus}, Grade=${student.grade}`),
      error: (err) => alert('Error updating: ' + err.message)
    });
  }
}
