import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, RouterLink],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentDashboard { }
