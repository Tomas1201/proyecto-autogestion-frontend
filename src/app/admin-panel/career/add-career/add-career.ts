import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { BackConnection, Subject } from '../../../back-connection.service';

import { SubjectConfigModal, ConfiguredSubject } from './subject-modal-config/subject-config-modal'; 

interface MateriaDisplay {
  id: any; 
  nombre: string;
}


export interface NewCareerData {
    name: string;
    description: string;
    duration: number;
    subjects: ConfiguredSubject[];
}

@Component({
  selector: 'app-add-career',
  standalone: true, 
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
    private dialog: MatDialog 
  ) {}

  ngOnInit(): void {
    
  }
  
  
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
    
    
    if (!this.newCareer.name || !this.newCareer.duration || this.newCareer.duration < 1 || this.newCareer.subjects.length === 0) {
        console.error("Formulario inválido o incompleto (Faltan Nombre, Duración o Asignaturas).");
        return; 
    }
    
    
    const careerDataToSend = {
      name: this.newCareer.name,
      description: this.newCareer.description,
      duration: Number(this.newCareer.duration), 
      
      subjects: this.newCareer.subjects.map(s => ({
          id: s.subjectId,
          year: Number(s.year), 
          correlativeId: s.correlativeId, 
      }))
    };
    
    
    this.dialogRef.close(careerDataToSend);
  }
}