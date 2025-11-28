import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BackConnection, Subject } from '../../back-connection.service';

export interface Exam extends Subject {
  examDate: Date;
  registered: boolean;
}

@Component({
  selector: 'app-final-exams',
  imports: [MatTableModule, MatCardModule, MatButtonModule, MatSnackBarModule, DatePipe],
  templateUrl: './final-exams.html',
  styleUrl: './final-exams.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinalExams implements OnInit {
  private readonly backConnection = inject(BackConnection);
  private readonly snackBar = inject(MatSnackBar);

  // We use a signal to hold the exams data. 
  exams = signal<Exam[]>([]);

  displayedColumns: string[] = ['subject', 'date', 'action'];

  ngOnInit() {
    this.loadExams();
  }

  loadExams() {
    // Ensure subjects are loaded first as our mock depends on them
    this.backConnection.loadSubject().subscribe(() => {
      this.backConnection.getStudentExams(1).subscribe(data => {
        // Cast the data to Exam[] since the service returns any[]
        this.exams.set(data as Exam[]);
      });
    });
  }

  register(exam: Exam) {
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
