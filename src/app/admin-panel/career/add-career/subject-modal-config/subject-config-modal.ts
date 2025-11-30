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
import { BackConnection, Subject } from '../../../../back-connection.service';


export interface ConfiguredSubject {
  tempId: number;
  subjectId: string;
  name: string;
  year: number | null;
  correlativeId: string | null;
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
  ) { }

  ngOnInit(): void {

    this.backConnection.getSubjects().subscribe({
      next: (subjects: Subject[]) => {
        this.availableSubjects = subjects;

        if (this.data.currentSubjects && this.data.currentSubjects.length > 0) {
          this.dataSource.data = this.data.currentSubjects.map(s => ({
            ...s,
            tempId: this.tempIdCounter++
          }));
        }

        this.updateAvailableForAddition();
      },
      error: (err) => {
        console.error('Error al cargar las materias:', err);
      }
    });
  }


  updateAvailableForAddition(): void {
    const selectedIds = this.dataSource.data.map(s => s.subjectId);
    this.availableForAddition = this.availableSubjects.filter(
      s => !selectedIds.includes(s.id)
    );
    this.selectedSubjectToAdd = null;
  }


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


  removeSubject(tempId: number): void {
    this.dataSource.data = this.dataSource.data.filter(s => s.tempId !== tempId);
    this.updateAvailableForAddition();
  }


  getCorrelativeOptions(currentSubjectId: string): ConfiguredSubject[] {
    return this.dataSource.data.filter(s => s.subjectId !== currentSubjectId);
  }


  compareSubjectIds(optionId: string | null, valueId: string | null): boolean {


    if (optionId === 'NO_CORRELATIVE' && valueId === null) {
      return true;
    }


    if (valueId === null && optionId !== 'NO_CORRELATIVE') {
      return false;
    }


    if (typeof optionId === 'string' && typeof valueId === 'string') {
      return optionId === valueId;
    }


    if (optionId === 'NO_CORRELATIVE' && valueId !== null) {
      return false;
    }

    
    return optionId === valueId;
  }

  onCancelar(): void {
    this.dialogRef.close();
  }

  onGuardar(): void {

    const hasInvalidYear = this.dataSource.data.some(s => !s.year || s.year < 1);
    if (hasInvalidYear) {
      console.error("Todas las asignaturas deben tener un año válido.");
      return;
    }


    const result: ConfiguredSubject[] = this.dataSource.data.map(s => ({
      subjectId: s.subjectId,
      name: s.name,
      year: s.year,

      correlativeId: s.correlativeId === 'NO_CORRELATIVE' ? null : s.correlativeId,
    } as ConfiguredSubject));

    this.dialogRef.close(result);
  }
}