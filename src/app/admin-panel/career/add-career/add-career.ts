import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { BackConnection, Subject } from '../../../back-connection.service';
// Importamos el nuevo componente modal
import { SubjectConfigModal, ConfiguredSubject } from './subject-modal-config/subject-config-modal'; 

interface MateriaDisplay {
  id: any; 
  nombre: string;
}

// Interfaz para la data que se espera recibir del modal de configuración
export interface NewCareerData {
    name: string;
    description: string;
    duration: number;
    subjects: ConfiguredSubject[];
}

@Component({
  selector: 'app-add-career',
  standalone: true, // Asumimos standalone para ser compatible con imports en el componente
  imports: [
    MatDialogModule, 
    MatIconModule, 
    FormsModule, 
    MatInputModule, 
    MatSelectModule, 
    MatButtonModule, 
    CommonModule
  ],
  templateUrl: './add-career.html',
  styleUrl: './add-career.css',
})
export class AddCareer implements OnInit {
 // Eliminamos materiasDisponibles y allBackendSubjects ya que serán usados en el nuevo modal
  newCareer: NewCareerData = { 
    name: '', 
    description: '', 
    duration: 0, 
    subjects: [] as ConfiguredSubject[] 
  };
    
  constructor(
    public dialogRef: MatDialogRef<AddCareer>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private backConnection: BackConnection,
    private dialog: MatDialog // Necesitamos inyectar MatDialog para abrir el nuevo modal
  ) {}

  ngOnInit(): void {
    // Ya no necesitamos cargar las materias aquí, el otro modal lo hará.
  }
  
  /**
   * Abre el modal de configuración de asignaturas.
   * Pasa las materias ya configuradas para editarlas.
   */
  openSubjectConfiguration(): void {
    const dialogRef = this.dialog.open(SubjectConfigModal, {
      minWidth: '400px',
      maxWidth: '800px',
      width: '95%',
      maxHeight: '90vh',
      data: { 
        currentSubjects: this.newCareer.subjects 
      }
    });

    dialogRef.afterClosed().subscribe((configuredSubjects: ConfiguredSubject[] | undefined) => {
        if (configuredSubjects) {
            console.log('Asignaturas configuradas recibidas:', configuredSubjects);
            this.newCareer.subjects = configuredSubjects;
        }
    });
  }

  onCancelar(): void {
    this.dialogRef.close();
  }

  onGuardar(): void {
    
    // La validación ahora debe incluir que haya al menos una asignatura configurada
    if (!this.newCareer.name || !this.newCareer.duration || this.newCareer.duration < 1 || this.newCareer.subjects.length === 0) {
        console.error("Formulario inválido o incompleto (Faltan Nombre, Duración o Asignaturas).");
        return; 
    }
    
    // Mapeamos los datos de salida al formato que espera el backend
    const careerDataToSend = {
      name: this.newCareer.name,
      description: this.newCareer.description,
      duration: Number(this.newCareer.duration), 
      // El backend esperará un array de objetos con id, year y correlativeId
      subjects: this.newCareer.subjects.map(s => ({
          id: s.subjectId,
          year: Number(s.year), // Aseguramos que el año sea numérico
          correlativeId: s.correlativeId, // Puede ser null
      }))
    };
    
    
    this.dialogRef.close(careerDataToSend);
  }
}