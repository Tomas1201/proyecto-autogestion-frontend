import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { ProfessorService } from '../../services/professor.service';
import { ProfessorSubject } from '../../shared/models/professor-subject.model';

@Component({
  selector: 'app-professor-my-subjects',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatIconModule],
  template: `
    <div class="container">
      <h2>Mis Asignaturas</h2>
      <div class="subjects-grid">
        @for (subject of subjects(); track subject.id) {
          <mat-card class="subject-card">
            <mat-card-header>
              <mat-card-title>{{ subject.subjectName }}</mat-card-title>
              <mat-card-subtitle>{{ subject.role }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p><strong>Horario:</strong> {{ subject.schedule }}</p>
            </mat-card-content>
          </mat-card>
        }
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .subjects-grid { display: flex; flex-wrap: wrap; gap: 20px; }
    .subject-card { width: 300px; }
  `]
})
export class ProfessorMySubjects implements OnInit {
  private professorService = inject(ProfessorService);
  subjects = signal<ProfessorSubject[]>([]);

  ngOnInit() {
    this.professorService.getProfessorSubjects().subscribe(s => this.subjects.set(s));
  }
}
