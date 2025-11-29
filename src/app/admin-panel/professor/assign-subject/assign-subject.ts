import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { BackConnection, Subject } from '../../../back-connection.service';

@Component({
    selector: 'app-assign-subject',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
    ],
    templateUrl: './assign-subject.html',
    styleUrls: ['./assign-subject.css']
})
export class AssignSubject implements OnInit {
    assignForm: FormGroup;
    subjects: Subject[] = [];
    roles: string[] = ['Titular', 'Adjunto', 'JTP', 'Ayudante'];

    constructor(
        private fb: FormBuilder,
        private backConnection: BackConnection,
        public dialogRef: MatDialogRef<AssignSubject>,
        @Inject(MAT_DIALOG_DATA) public data: { professorId: string }
    ) {
        this.assignForm = this.fb.group({
            subjectId: ['', Validators.required],
            role: ['', Validators.required],
            schedule: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.loadSubjects();
    }

    loadSubjects() {
        this.backConnection.getSubjects().subscribe({
            next: (response: any) => {
                // Assuming response structure, adjust if needed
                this.subjects = response.data || response;
            },
            error: (err) => console.error('Error loading subjects', err)
        });
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        if (this.assignForm.valid) {
            this.dialogRef.close({
                professorId: this.data.professorId,
                ...this.assignForm.value
            });
        }
    }
}
