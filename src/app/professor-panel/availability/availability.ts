import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ProfessorService } from '../../services/professor.service';

@Component({
  selector: 'app-professor-availability',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
  ],
  template: `
    <div class="container">
      <h2>Mi Disponibilidad</h2>
      <mat-card class="availability-card">
        <mat-card-content>
          <p>Define tus horarios disponibles para consultas o clases extra.</p>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Disponibilidad Horaria</mat-label>
            <textarea matInput [(ngModel)]="availability" rows="5"></textarea>
          </mat-form-field>
        </mat-card-content>
        <mat-card-actions align="end">
          <button mat-raised-button color="primary" (click)="save()">Guardar Cambios</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .availability-card { max-width: 600px; }
    .full-width { width: 100%; }
  `]
})
export class ProfessorAvailability implements OnInit {
  private professorService = inject(ProfessorService);
  availability = '';

  ngOnInit() {
    this.professorService.getCurrentProfessor().subscribe(p => {
      this.availability = p.data.scheduleAvailability;
    });
  }

  save() {
    this.professorService.updateAvailability(this.availability).subscribe(() => {
      alert('Disponibilidad actualizada correctamente');
    });
  }
}
