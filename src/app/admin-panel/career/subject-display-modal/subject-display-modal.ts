import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

// Interfaz reutilizada de ConfiguredSubject para tipar los datos
export interface ConfiguredSubject {
    subjectId: string;
    name: string;
    year: number | null;
    correlativeId: string | null;
}

// Datos que se inyectarán al modal desde CareerComponent
interface SubjectModalData {
    careerName: string;
    subjects: ConfiguredSubject[];
}

@Component({
  selector: 'app-subject-display-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './subject-display-modal.html', 
  styleUrls: ['./subject-display-modal.css'],  
})
export class SubjectDisplayModal implements OnInit {
  
  displayedColumns: string[] = ['name', 'year', 'correlative'];
  dataSource: MatTableDataSource<ConfiguredSubject>;
  
  subjectNameMap: Map<string, string> = new Map();

  constructor(
    public dialogRef: MatDialogRef<SubjectDisplayModal>,
    @Inject(MAT_DIALOG_DATA) public data: SubjectModalData
  ) {
    this.dataSource = new MatTableDataSource(data.subjects);
  }
  
  ngOnInit(): void {
   
    this.data.subjects.forEach(subject => {
        if (subject.subjectId && subject.name) {
            this.subjectNameMap.set(subject.subjectId, subject.name);
        }
    });
  }
  
  
  getCorrelativeName(correlativeId: string): string {
    return this.subjectNameMap.get(correlativeId) || correlativeId;
  }

  onClose(): void {
    this.dialogRef.close();
  }
}