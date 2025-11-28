import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BackConnection, Subject } from '../../back-connection.service';

export interface RegistrationSubject extends Subject {
    year: number;
    prerequisitesMet: boolean;
    registered?: boolean; // Local state to track registration during session
}

@Component({
    selector: 'app-subject-registration',
    imports: [CommonModule, MatTableModule, MatCardModule, MatButtonModule, MatSnackBarModule],
    templateUrl: './subject-registration.html',
    styleUrl: './subject-registration.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubjectRegistration implements OnInit {
    private readonly backConnection = inject(BackConnection);
    private readonly snackBar = inject(MatSnackBar);

    subjects = signal<RegistrationSubject[]>([]);
    displayedColumns: string[] = ['name', 'year', 'action'];

    ngOnInit() {
        this.loadSubjects();
    }

    loadSubjects() {
        // Hardcoded student ID and career ID for now
        this.backConnection.getAvailableSubjectsForRegistration(1, 1).subscribe(data => {
            this.subjects.set(data);
        });
    }

    register(subject: RegistrationSubject) {
        if (!subject.prerequisitesMet) {
            this.snackBar.open('No cumples con las correlativas para esta materia.', 'Cerrar', { duration: 3000 });
            return;
        }

        if (confirm(`¿Confirmar inscripción a ${subject.name}?`)) {
            this.backConnection.registerForSubject(1, subject.id).subscribe({
                next: () => {
                    this.snackBar.open('Inscripción exitosa', 'Cerrar', { duration: 3000 });
                    this.subjects.update(current =>
                        current.map(s => s.id === subject.id ? { ...s, registered: true } : s)
                    );
                },
                error: (err) => {
                    this.snackBar.open(err.message || 'Error al inscribirse', 'Cerrar', { duration: 3000 });
                }
            });
        }
    }
}
