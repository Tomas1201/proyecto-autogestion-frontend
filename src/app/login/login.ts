import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService, UserRole } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    identifier: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  hidePassword = signal(true);
  errorMessage = signal('');
  isLoading = signal(false);

  togglePasswordVisibility(): void {
    this.hidePassword.update(value => !value);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    const { identifier, password } = this.loginForm.value;

    this.authService.login(identifier!, password!).subscribe({
      next: () => {
        const role = this.authService.userRole();
       console.log(role);
        if (role === UserRole.Admin) {
          this.router.navigate(['/MainView']);
        } else if (role === UserRole.Student) {
          this.router.navigate(['/student-panel']);
        } else if (role === UserRole.Professor) {
          // Placeholder for professor panel
          console.log('Redirect to Professor Panel');
        }
      },
      error: (err) => {
        this.errorMessage.set(err.message || 'Error al iniciar sesión');
        this.isLoading.set(false);
      }
    });
  }
}