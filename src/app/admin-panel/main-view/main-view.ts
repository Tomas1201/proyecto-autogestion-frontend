import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTableModule} from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'mainViewComponent',
  standalone: true,
  imports: [MatCardModule,
    MatDividerModule,
    MatListModule, MatToolbarModule,CommonModule],
  templateUrl: './main-view.html',
  styleUrl: './main-view.css',
})
export class MainView {
  menuItems = [
    { name: 'Gestión de Carreras' , route: '/Career' },
    { name: 'Gestión de Materias' , route: '/Subject' },
    { name: 'Gestión de Profesores', route: '/Professor' },
    { name: 'Gestión de Alumnos', route: '/Student' },
  ];
  constructor(private router: Router) {} 

  
  navegarA(ruta: string) {
    
    this.router.navigate([ruta]);
  }
}



