import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { BackConnection } from '../../back-connection.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-grades',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule],
  templateUrl: './grades.html',
  styleUrl: './grades.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Grades implements OnInit {
  private backConnection = inject(BackConnection);
  private authService = inject(AuthService);

  
  grades = toSignal(this.backConnection.getStudentGrades(this.authService.currentUser()?.id || "1").pipe(
    map((data: any[]) => data.map(item => ({
      subject: item.Exam?.AcademicPosition?.Subject?.name || 'Unknown',
      exam: item.Exam?.description || 'Exam',
      grade: item.value,
      feedback: item.feedback
    })))
  ), { initialValue: [] });

  displayedColumns: string[] = ['subject', 'exam', 'grade'];

  ngOnInit() {
    
  }
}
