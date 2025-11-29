import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { BackConnection } from '../../back-connection.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-my-subjects',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule],
  templateUrl: './my-subjects.html',
  styleUrl: './my-subjects.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MySubjects implements OnInit {
  private backConnection = inject(BackConnection);
  private authService = inject(AuthService);

  subjects = toSignal(this.backConnection.getStudentSubjects(this.authService.currentUser()?.id || "1"), { initialValue: [] });

  displayedColumns: string[] = ['id', 'name', 'status'];

  ngOnInit() {
    this.backConnection.loadSubject().subscribe();
  }
}
