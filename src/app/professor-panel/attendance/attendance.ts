import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ProfessorService } from '../../services/professor.service';
import { ProfessorSubject } from '../../shared/models/professor-subject.model';

@Component({
  selector: 'app-professor-attendance',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    FormsModule,
  ],
  template: `
    <div class="container">
      <h2>Asistencias</h2>
      
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

          <ng-container matColumnDef="present">
            <th mat-header-cell *matHeaderCellDef> Presente </th>
            <td mat-cell *matCellDef="let element">
              <mat-checkbox [(ngModel)]="element.present"></mat-checkbox>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <div class="actions">
          <button mat-raised-button color="primary" (click)="saveAttendance()">Guardar Asistencia</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .subject-select { width: 100%; max-width: 400px; margin-bottom: 20px; }
    table { width: 100%; margin-bottom: 20px; }
    .actions { display: flex; justify-content: flex-end; }
  `]
})
export class ProfessorAttendance implements OnInit {
  private professorService = inject(ProfessorService);
  
  subjects = signal<ProfessorSubject[]>([]);
  students = signal<any[]>([]);
  selectedSubjectId = '';
  displayedColumns = ['name', 'present'];

  ngOnInit() {
    this.professorService.getProfessorSubjects().subscribe(s => this.subjects.set(s));
  }

  onSubjectChange() {
    if (this.selectedSubjectId) {
      const today = new Date().toISOString().split('T')[0];
      // Load students first
      this.professorService.getStudentsBySubject(this.selectedSubjectId).subscribe(students => {
        // Then load attendance for today
        this.professorService.getAttendance(this.selectedSubjectId, today).subscribe(attendance => {
          const merged = students.map(stu => {
            const att = attendance.find(a => a.studentId === stu.studentId);
            return { ...stu, present: att ? att.isPresent : false };
          });
          this.students.set(merged);
        });
      });
    }
  }

  saveAttendance() {
    const today = new Date().toISOString().split('T')[0];
    const attendanceData = this.students().map(s => ({ studentId: s.studentId, isPresent: s.present }));
    
    this.professorService.saveAttendance(this.selectedSubjectId, today, attendanceData).subscribe({
      next: () => alert('Asistencia guardada correctamente'),
      error: (err) => alert('Error guardando asistencia: ' + err.message)
    });
  }
}
