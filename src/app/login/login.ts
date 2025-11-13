import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Form } from '../email-field/email-field';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, MatButtonModule, MatCardModule, Form],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  credentials = {
    username: '',
    password: '',
  };

  constructor() {}

  onSubmit(): void {
    console.log('Formulario enviado');
    console.log('Credenciales:', this.credentials);
  }
}
