import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { BackConnection } from '../../back-connection.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule],
  templateUrl: './attendance.html',
  styleUrl: './attendance.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Attendance implements OnInit {
  private backConnection = inject(BackConnection);

  attendance = toSignal(this.backConnection.getStudentAttendance(1), { initialValue: [] });

  displayedColumns: string[] = ['subject', 'attendance'];

  ngOnInit() {
    this.backConnection.loadSubject().subscribe();
  }
}
