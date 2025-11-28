import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatIconModule,
        MatSnackBarModule,
        RouterModule
    ],
    templateUrl: './register.html',
    styleUrl: './register.css'
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);
    private snackBar = inject(MatSnackBar);

    registerForm = this.fb.group({
        role: ['', Validators.required],
        file: ['', Validators.required],
        password: ['', Validators.required]
    });

    hidePassword = true;
    isLoading = false;

    onSubmit() {
        if (this.registerForm.valid) {
            this.isLoading = true;
            const { role, file, password } = this.registerForm.value;

            this.authService.register(file!, password!, role!).subscribe({
                next: () => {
                    this.snackBar.open('Registro exitoso. Por favor inicie sesión.', 'Cerrar', { duration: 3000 });
                    this.router.navigate(['/login']);
                },
                error: (err) => {
                    this.isLoading = false;
                    this.snackBar.open(err.error?.message || 'Error al registrarse', 'Cerrar', { duration: 3000 });
                }
            });
        }
    }
}
