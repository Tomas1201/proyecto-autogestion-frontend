import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BackConnection, Subject } from '../../back-connection.service';
import { AuthService } from '../../auth.service';

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
  private readonly authService = inject(AuthService);

  // We use a signal to hold the exams data. 
  exams = signal<Exam[]>([]);

  displayedColumns: string[] = ['subject', 'date', 'action'];

  ngOnInit() {
    this.loadExams();
  }

  loadExams() {
    const studentId = this.authService.currentUser()?.id || 0;
    this.backConnection.getStudentExams(studentId).subscribe(data => {
      const mappedExams: Exam[] = data.map((item: any) => ({
        id: item.id, // finalExamId
        name: item.Subject ? item.Subject.name : 'Unknown',
        examDate: new Date(item.date),
        registered: false // Default to false as backend doesn't return this yet
      }));
      this.exams.set(mappedExams);
    });
  }

  register(exam: Exam) {
    if (confirm(`¿Confirmar inscripción a ${exam.name}?`)) {
      const studentId = this.authService.currentUser()?.id || 0;
      this.backConnection.registerForExam(studentId, exam.id).subscribe({
        next: () => {
          this.snackBar.open('Inscripción exitosa', 'Cerrar', { duration: 3000 });
          // Update local state
          this.exams.update(currentExams =>
            currentExams.map(e => e.id === exam.id ? { ...e, registered: true } : e)
          );
        },
        error: (err) => {
          this.snackBar.open(err.error?.message || 'Error al inscribirse', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}
