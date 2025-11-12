import { Component, OnInit, ViewChild } from '@angular/core'; 
import { MatTableModule, MatTableDataSource } from '@angular/material/table'; 
import { MatSort, MatSortModule } from '@angular/material/sort'; 
import { MatIconModule } from '@angular/material/icon'; 
import { MatButtonModule } from '@angular/material/button'; 
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddCareer } from './add-career/add-career';

export interface Career {
  id: number; 
  name: string;
  subjects: string; 
  description: string;
  duration: number; 
}



@Component({
  selector: 'app-career-self-management',
  imports: [
    MatTableModule, 
    MatSortModule,       
    MatButtonModule,     
    MatIconModule,       
    MatFormFieldModule,  
    MatInputModule,
    MatDialogModule
  ],
  templateUrl: './career.html',
  styleUrls: ['./career.css'],
})
export class CareerSelfManagement implements OnInit {
  constructor(private dialog: MatDialog) { }
  

  
  private careerData: Career[] = [
    {id: 1, name: 'Ing. Sistemas', subjects: 'Ver Materias', description: 'Análisis y desarrollo de software', duration: 5},
    {id: 2, name: 'Arquitectura', subjects: 'Ver Materias', description: 'Diseño y construcción de espacios', duration: 4},
    
  ];
  
  displayedColumns: string[] = ['name', 'subjects', 'description', 'duration', 'actions'];

  
  dataSource = new MatTableDataSource(this.careerData);
  
  @ViewChild(MatSort) sort!: MatSort; 

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  addCareer() {
    
    const dialogRef = this.dialog.open(AddCareer, {
      minWidth: '300px',
      maxWidth: '600px',
      width: '90%'
    });

    dialogRef.afterClosed().subscribe(newCareer => {
      if (newCareer) {
        console.log('Carrera recibida:', newCareer);
        
        if (!('id' in newCareer) || newCareer.id == null) {
          const maxId = this.careerData.length ? Math.max(...this.careerData.map(c => c.id)) : 0;
          newCareer.id = maxId + 1;
        }
        this.careerData.push(newCareer as Career);
        this.dataSource.data = this.careerData;
      }
    });
  }

  editCareer(career: Career) {
    console.log('Editar:', career);
    
  }

  /**
   * 
   * @param id El ID de la carrera a eliminar.
   */
  deleteCareer(id: number) {
     
    
    if (!confirm('¿Estás seguro de que deseas eliminar esta carrera?')) {
      return; 
    }
      
   
    this.careerData = this.careerData.filter(career => career.id !== id);

    
    this.dataSource.data = this.careerData;
    
    console.log(`Carrera con ID ${id} eliminada.`);
  }
}
    
  

