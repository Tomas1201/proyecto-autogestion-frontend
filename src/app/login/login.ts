import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
// Necesitas MatIconModule para usar los iconos
import { MatIconModule } from '@angular/material/icon'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule // 👈 IMPORTADO
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  credentials = {
    email: '',
    password: '',
  };
  
  // 🔑 Variables de Control de Contraseña
  hidePassword = true; // Por defecto, la contraseña está oculta

  // 👁️ Método para alternar la visibilidad
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(): void {
    console.log('Intentando iniciar sesión con:', this.credentials);
  }
}