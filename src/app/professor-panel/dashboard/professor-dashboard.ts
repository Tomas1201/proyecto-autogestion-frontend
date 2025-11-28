import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ProfessorService } from '../../services/professor.service';
import { Professor } from '../../shared/models/professor.model';
import { ProfessorSubject } from '../../shared/models/professor-subject.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-professor-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './professor-dashboard.html',
  styleUrl: './professor-dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfessorDashboard implements OnInit {
  private professorService = inject(ProfessorService);

  professor = signal<Professor | null>(null);
  subjects = signal<ProfessorSubject[]>([]);

  ngOnInit() {
    this.professorService.getCurrentProfessor().subscribe((p) => this.professor.set(p));
    this.professorService.getProfessorSubjects().subscribe((s) => this.subjects.set(s));
  }
}
