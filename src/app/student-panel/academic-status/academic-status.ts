import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { BackConnection } from '../../back-connection.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-academic-status',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatDividerModule],
  templateUrl: './academic-status.html',
  styleUrl: './academic-status.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AcademicStatus {
  private backConnection = inject(BackConnection);

  status = toSignal(this.backConnection.getStudentAcademicStatus(1));
}
