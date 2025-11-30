import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BackConnection, Subject } from '../../../../back-connection.service'; // RUTA CRÍTICA: Ajusta la ruta

// Interfaz que representa una asignatura con sus metadatos de carrera
export interface ConfiguredSubject {
    tempId: number; // ID temporal para Angular trackBy
    subjectId: string; // ID real de la materia
    name: string;    // Nombre de la materia (para display)
    year: number | null;
    correlativeId: string | null; // ID de la correlativa (puede ser null)
}

@Component({
  selector: 'app-subject-config-modal',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatDialogModule, 
    MatTableModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatButtonModule, 
    MatIconModule
  ],
  templateUrl: './subject-config-modal.html',
  styleUrls: ['./subject-config-modal.css']
})
export class SubjectConfigModal implements OnInit {
  
  availableSubjects: Subject[] = [];
  dataSource = new MatTableDataSource<ConfiguredSubject>([]);
  displayedColumns: string[] = ['name', 'year', 'correlative', 'actions'];
  availableForAddition: Subject[] = [];
  selectedSubjectToAdd: string | null = null;
  tempIdCounter = 0; 

  constructor(
    public dialogRef: MatDialogRef<SubjectConfigModal>,
    @Inject(MAT_DIALOG_DATA) public data: { currentSubjects: ConfiguredSubject[] },
    private backConnection: BackConnection
  ) {}

  ngOnInit(): void {
    // 1. Cargar todas las asignaturas disponibles del backend
    this.backConnection.getSubjects().subscribe({
      next: (subjects: Subject[]) => {
        this.availableSubjects = subjects;
        // 2. Inicializar la tabla con los datos que vienen del modal padre (si los hay)
        if (this.data.currentSubjects && this.data.currentSubjects.length > 0) {
            this.dataSource.data = this.data.currentSubjects.map(s => ({
                ...s,
                tempId: this.tempIdCounter++
            }));
        }
        // 3. Actualizar la lista de asignaturas disponibles para agregar
        this.updateAvailableForAddition();
      },
      error: (err) => {
        console.error('Error al cargar las materias:', err);
      }
    });
  }
  
  /**
   * Filtra las asignaturas disponibles para agregar, excluyendo las que ya están en la tabla.
   */
  updateAvailableForAddition(): void {
    const selectedIds = this.dataSource.data.map(s => s.subjectId);
    this.availableForAddition = this.availableSubjects.filter(
        s => !selectedIds.includes(s.id)
    );
    this.selectedSubjectToAdd = null; 
  }

  /**
   * Agrega una nueva fila a la tabla con la asignatura seleccionada.
   */
  addSubject(): void {
    if (!this.selectedSubjectToAdd) return;

    const subjectToAdd = this.availableSubjects.find(s => s.id === this.selectedSubjectToAdd);
    if (subjectToAdd) {
        const newSubject: ConfiguredSubject = {
            tempId: this.tempIdCounter++,
            subjectId: subjectToAdd.id,
            name: subjectToAdd.name,
            year: 1, 
            correlativeId: null,
        };
        
        this.dataSource.data = [...this.dataSource.data, newSubject];
        this.updateAvailableForAddition();
    }
  }

  /**
   * Elimina una fila de la tabla.
   */
  removeSubject(tempId: number): void {
    this.dataSource.data = this.dataSource.data.filter(s => s.tempId !== tempId);
    this.updateAvailableForAddition();
  }
  
  /**
   * Devuelve las asignaturas disponibles para correlatividad (todas excepto la actual).
   */
  getCorrelativeOptions(currentSubjectId: string): ConfiguredSubject[] {
    return this.dataSource.data.filter(s => s.subjectId !== currentSubjectId);
  }
  
  /**
   * Función de comparación CRÍTICA.
   * La opción 'NO_CORRELATIVE' del HTML se compara con el valor 'null' del modelo de datos.
   */
  compareSubjectIds(optionId: string | null, valueId: string | null): boolean {
    
    // CASO 1: Si la opción es 'NO_CORRELATIVE' (del HTML) y el valor es null (del modelo)
    if (optionId === 'NO_CORRELATIVE' && valueId === null) {
        return true;
    }
    
    // CASO 2: Si el valor del modelo es null y se selecciona la opción de correlativa (no debería pasar)
    if (valueId === null && optionId !== 'NO_CORRELATIVE') {
        return false;
    }

    // CASO 3: Comparación de IDs de materias (string)
    if (typeof optionId === 'string' && typeof valueId === 'string') {
        return optionId === valueId;
    }

    // CASO 4: Si se está mostrando la opción 'NO_CORRELATIVE' pero el valor del modelo es un ID real
    if (optionId === 'NO_CORRELATIVE' && valueId !== null) {
        return false;
    }
    
    // Fallback general:
    return optionId === valueId;
  }

  onCancelar(): void {
    this.dialogRef.close();
  }

  onGuardar(): void {
    // Validar que todas las asignaturas tengan un año válido
    const hasInvalidYear = this.dataSource.data.some(s => !s.year || s.year < 1);
    if (hasInvalidYear) {
        console.error("Todas las asignaturas deben tener un año válido.");
        return; 
    }
    
    // Devolver solo los datos necesarios al componente padre, asegurando que 'NO_CORRELATIVE' se convierta a null
    const result: ConfiguredSubject[] = this.dataSource.data.map(s => ({
        subjectId: s.subjectId,
        name: s.name,
        year: s.year,
        // Si el valor guardado es 'NO_CORRELATIVE', se reemplaza con null
        correlativeId: s.correlativeId === 'NO_CORRELATIVE' ? null : s.correlativeId,
    } as ConfiguredSubject));
    
    this.dialogRef.close(result);
  }
}