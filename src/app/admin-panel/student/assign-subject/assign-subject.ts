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
    selector: 'app-assign-student-subject',
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
export class AssignStudentSubject implements OnInit {
    assignForm: FormGroup;
    subjects: Subject[] = [];
    statuses: string[] = ['Cursando', 'Aprobada', 'Regular', 'Libre'];

    constructor(
        private fb: FormBuilder,
        private backConnection: BackConnection,
        public dialogRef: MatDialogRef<AssignStudentSubject>,
        @Inject(MAT_DIALOG_DATA) public data: { studentId: string }
    ) {
        this.assignForm = this.fb.group({
            subjectId: ['', Validators.required],
            status: ['Cursando', Validators.required]
        });
    }

    ngOnInit(): void {
        this.loadSubjects();
    }

    loadSubjects() {
        this.backConnection.getSubjects().subscribe({
            next: (response: any) => {
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
                studentId: this.data.studentId,
                ...this.assignForm.value
            });
        }
    }
}
