import { Component, ChangeDetectionStrategy, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { BackConnection } from '../../back-connection.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { AuthService } from '../../auth.service';

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
  private authService = inject(AuthService);
  private fileNumber = computed(() => this.authService.currentUser()?.fileNumber);
  private userId = computed(() => this.authService.currentUser()?.id);

  attendance = toSignal(this.backConnection.getStudentAttendance((this.userId() || "1")).pipe(
    map((data: any[]) => {
      
      const grouped = data.reduce((acc, curr) => {
        const subjectName = curr.AcademicPosition?.Subject?.name || 'Unknown';
        if (!acc[subjectName]) {
          acc[subjectName] = { total: 0, present: 0 };
        }
        acc[subjectName].total++;
        if (curr.isPresent) {
          acc[subjectName].present++;
        }
        return acc;
      }, {} as Record<string, { total: number, present: number }>);

      
      return Object.keys(grouped).map(subject => ({
        subject,
        attendance: Math.round((grouped[subject].present / grouped[subject].total) * 100) + '%'
      }));
    })
  ), { initialValue: [] });

  displayedColumns: string[] = ['subject', 'attendance'];

  ngOnInit() {
    
  }
}
