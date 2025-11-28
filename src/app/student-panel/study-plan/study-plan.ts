import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { BackConnection } from '../../back-connection.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-study-plan',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule],
  templateUrl: './study-plan.html',
  styleUrl: './study-plan.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudyPlan implements OnInit {
  private backConnection = inject(BackConnection);

  subjects = toSignal(this.backConnection.getStudyPlan(1), { initialValue: [] });

  displayedColumns: string[] = ['id', 'name', 'year'];

  ngOnInit() {
    this.backConnection.loadSubject().subscribe();
  }
}
