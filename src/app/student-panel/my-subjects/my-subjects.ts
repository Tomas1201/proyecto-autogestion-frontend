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

  // Using toSignal to convert Observable to Signal
  // We pass an initial value or requireSync if we are sure it emits synchronously (which it doesn't here)
  subjects = toSignal(this.backConnection.getStudentSubjects(this.authService.currentUser()?.id || 0), { initialValue: [] });

  displayedColumns: string[] = ['id', 'name', 'status'];

  ngOnInit() {
    // Trigger load if necessary, but getStudentSubjects returns an observable derived from subjects$
    // We might need to ensure subjects are loaded in the service.
    // The service has loadSubject() method but it's not called automatically.
    // We should call it.
    this.backConnection.loadSubject().subscribe();
  }
}
