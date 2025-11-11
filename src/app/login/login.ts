import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {FormFieldErrorExample} from '../email-field/email-field';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    FormFieldErrorExample
  ],
   changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
// 1. **Propiedad para el enlace de datos (ngModel):**
  // Debe coincidir con 'credentials' usado en el template.
  // Es una buena práctica tipar esta propiedad para definir la estructura de los datos del formulario.
  credentials = {
    username: '',
    password: ''
  };

  constructor() { }

  // 2. **Método para el envío del formulario (ngSubmit):**
  // Debe coincidir con 'onSubmit()' usado en el template.
  onSubmit(): void {
    console.log('Formulario enviado');
    console.log('Credenciales:', this.credentials);

    // Aquí iría la lógica real, como llamar a un servicio de autenticación
    // por ejemplo: this.authService.login(this.credentials).subscribe(response => { ... });
    
    // Opcionalmente, puedes limpiar el formulario después del envío
    // this.credentials = { username: '', password: '' }; 
  }
}
