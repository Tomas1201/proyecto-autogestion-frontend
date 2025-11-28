import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BackConnection } from '../../back-connection.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-final-exams',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './final-exams.html',
  styleUrl: './final-exams.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinalExams implements OnInit {
  private backConnection = inject(BackConnection);
  private snackBar = inject(MatSnackBar);

  // We use a signal to hold the exams data. 
  // Since we need to update the local state (mark as registered), we might want a writable signal 
  // initialized from the service, or just handle the registration logic carefully.
  // For simplicity, I'll subscribe and set a local signal.
  exams = signal<any[]>([]);

  displayedColumns: string[] = ['subject', 'date', 'action'];

  ngOnInit() {
    this.loadExams();
  }

  loadExams() {
    // Ensure subjects are loaded first as our mock depends on them
    this.backConnection.loadSubject().subscribe(() => {
      this.backConnection.getStudentExams(1).subscribe(data => {
        this.exams.set(data);
      });
    });
  }

  register(exam: any) {
    if (confirm(`¿Confirmar inscripción a ${exam.name}?`)) {
      this.backConnection.registerForExam(1, exam.id).subscribe({
        next: () => {
          this.snackBar.open('Inscripción exitosa', 'Cerrar', { duration: 3000 });
          // Update local state
          this.exams.update(currentExams =>
            currentExams.map(e => e.id === exam.id ? { ...e, registered: true } : e)
          );
        },
        error: () => {
          this.snackBar.open('Error al inscribirse', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}
