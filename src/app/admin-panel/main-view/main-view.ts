import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'mainViewComponent',
  standalone: true,
  imports: [MatCardModule,
    MatDividerModule,
    MatListModule, MatToolbarModule, CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './main-view.html',
  styleUrl: './main-view.css',
})
export class MainView {
  menuItems = [
    { name: 'Gestión de Carreras', route: '/Career' },
    { name: 'Gestión de Materias', route: '/Subject' },
    { name: 'Gestión de Profesores', route: '/Professor' },
    { name: 'Gestión de Alumnos', route: '/Student' },
    { name: 'Gestión Académica', route: '/AcademicManagement' },
  ];
  private authService = inject(AuthService);
  constructor(private router: Router) { }


  navegarA(ruta: string) {

    this.router.navigate([ruta]);
  }

  logout() {
    this.authService.logout();
  }
}



