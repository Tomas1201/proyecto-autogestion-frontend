import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { BackConnection } from '../../back-connection.service';
import { toSignal } from '@angular/core/rxjs-interop';

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

  grades = toSignal(this.backConnection.getStudentGrades(1), { initialValue: [] });

  displayedColumns: string[] = ['subject', 'firstPartial', 'secondPartial'];

  ngOnInit() {
    this.backConnection.loadSubject().subscribe();
  }
}
