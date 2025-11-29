import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { BackConnection } from '../../../back-connection.service';
interface MateriaDisplay {
  id: any; 
  nombre: string;
}


interface BackendSubject {
    id: any; 
    name: string; 
    
}
@Component({
  selector: 'app-add-career',
  imports: [MatDialogModule, MatIconModule, FormsModule, MatInputModule, MatSelectModule],
  templateUrl: './add-career.html',
  styleUrl: './add-career.css',
})
export class AddCareer {
 materiasDisponibles: MateriaDisplay[] = [];
 private allBackendSubjects: BackendSubject[] = [];
  newCareer = { name: '', description: '', duration: 0, materiasSeleccionadas: [] as any };

  constructor(
    public dialogRef: MatDialogRef<AddCareer>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private backConnection: BackConnection
  ) {}
  ngOnInit(): void {
    this.loadAvailableSubjects();
  }
  loadAvailableSubjects(): void {this.backConnection.getSubjects().subscribe({
      next: (subjects: BackendSubject[]) => {
        
     
        this.allBackendSubjects = subjects; 
        
        
        this.materiasDisponibles = subjects.map(subject => ({
            id: subject.id,
            nombre: subject.name 
        }));
       
      },
      error: (err) => {
        
        console.error('Error al cargar las materias:', err);
      }
    });
  }

  onCancelar(): void {
    this.dialogRef.close();
  }

onGuardar(): void {
    
    if (!this.newCareer.name || !this.newCareer.duration || this.newCareer.duration < 1) {
        console.error("Formulario inválido o incompleto.");
        return; 
    }
    
    
    const selectedSubjectsObjects: BackendSubject[] = this.newCareer.materiasSeleccionadas
        .map((selectedId: any) => {
            const subject = this.allBackendSubjects.find(s => s.id === selectedId);
            return subject ? { id: subject.id, name: subject.name } : null;
        })
        .filter((subject: BackendSubject | null): subject is BackendSubject => subject !== null);

   
    const { materiasSeleccionadas, ...rest } = this.newCareer;
    
   
    const careerData = {
        ...rest, 
        duration: Number(rest.duration), 
        subjects: selectedSubjectsObjects 
    };
    
    
    this.dialogRef.close(careerData);
  }
}
