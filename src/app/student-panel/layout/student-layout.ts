import { Component, ChangeDetectionStrategy, inject, signal, OnInit, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { BackConnection, Career } from '../../back-connection.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  templateUrl: './student-layout.html',
  styleUrl: './student-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentLayout implements OnInit {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly backConnection = inject(BackConnection);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private fileNumber = computed(() => this.authService.currentUser()?.fileNumber);
  private fileNumber1 = this.authService.currentUser()?.id || "1";

  isHandset = toSignal(
    this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(map(result => result.matches)),
    { initialValue: false }
  );

  careers = signal<Career[]>([]);
  selectedCareer = signal<Career | null>(null);

  ngOnInit() {
    this.loadCareers();
  }

  loadCareers() {
    // Hardcoded student ID for now
    this.backConnection.getStudentCareers(this.fileNumber1).subscribe(data => {
      this.careers.set(data);
      if (data.length > 0) {
        this.selectedCareer.set(data[0]);
      }
    });
  }

  onCareerChange(career: Career) {
    this.selectedCareer.set(career);
    // Here you might want to trigger a global state update or reload data
    console.log('Selected career:', career);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
