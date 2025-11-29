import { Component, ChangeDetectionStrategy, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BackConnection, Subject } from '../../back-connection.service';
import { AuthService } from '../../auth.service';

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
    private authService = inject(AuthService);
    private fileNumber = computed(() => this.authService.currentUser()?.fileNumber);
    private fileNumber1 = this.authService.currentUser()?.id || "1";

    subjects = signal<RegistrationSubject[]>([]);
    displayedColumns: string[] = ['name', 'year', 'action'];

    ngOnInit() {
        this.loadSubjects();
    }

    loadSubjects() {
        // Backend infers student from token. Passing placeholders if needed, or real data.
        // Using fileNumber as studentId if that's what the service expects, or just 0 if backend ignores it.
        // The user requested using currentUser elements.
        const studentId = this.fileNumber1;
        this.backConnection.getAvailableSubjectsForRegistration(studentId, "0").subscribe(data => {
            // Map backend AcademicPosition to RegistrationSubject
            const mappedSubjects: RegistrationSubject[] = data.map((item: any) => ({
                id: item.id, // This is academicPositionId
                name: item.Subject ? item.Subject.name : 'Unknown',
                year: item.year || 1,
                prerequisitesMet: true,
                registered: false
            }));
            this.subjects.set(mappedSubjects);
        });
    }

    register(subject: RegistrationSubject) {
        if (!subject.prerequisitesMet) {
            this.snackBar.open('No cumples con las correlativas para esta materia.', 'Cerrar', { duration: 3000 });
            return;
        }

        if (confirm(`¿Confirmar inscripción a ${subject.name}?`)) {
            const studentId = this.fileNumber1;
            this.backConnection.registerForSubject(studentId, subject.id.toString()).subscribe({
                next: () => {
                    this.snackBar.open('Inscripción exitosa', 'Cerrar', { duration: 3000 });
                    this.subjects.update(current =>
                        current.map(s => s.id === subject.id ? { ...s, registered: true } : s)
                    );
                },
                error: (err) => {
                    this.snackBar.open(err.error?.message || 'Error al inscribirse', 'Cerrar', { duration: 3000 });
                }
            });
        }
    }
}
