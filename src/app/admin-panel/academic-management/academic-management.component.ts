import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CycleService } from '../../services/cycle.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
    selector: 'app-academic-management',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSlideToggleModule,
        MatSnackBarModule
    ],
    templateUrl: './academic-management.component.html',
    styleUrls: ['./academic-management.component.css']
})
export class AcademicManagementComponent {
    private cycleService = inject(CycleService);
    private fb = inject(FormBuilder);
    private snackBar = inject(MatSnackBar);

    currentCycle = signal<any>(null);

    cycleForm = this.fb.group({
        year: [new Date().getFullYear(), [Validators.required, Validators.min(2000)]],
        fourMonthPeriod: [1, [Validators.required, Validators.min(1), Validators.max(2)]],
        startTime: ['', Validators.required],
        finalTime: ['', Validators.required]
    });

    constructor() {
        this.loadCurrentCycle();
    }

    loadCurrentCycle() {
        this.cycleService.getCurrentCycle().subscribe({
            next: (cycle) => this.currentCycle.set(cycle),
            error: (err) => console.error('Error loading cycle', err)
        });
    }

    createCycle() {
        if (this.cycleForm.invalid) return;

        const { year, fourMonthPeriod, startTime, finalTime } = this.cycleForm.value;

        const data = {
            year: Number(year),
            fourMonthPeriod: Number(fourMonthPeriod),
            startTime: new Date(startTime!),
            finalTime: new Date(finalTime!)
        };

        this.cycleService.createCycle(data).subscribe({
            next: (res) => {
                this.snackBar.open('Ciclo lectivo creado exitosamente', 'Cerrar', { duration: 3000 });
                this.loadCurrentCycle();
            },
            error: (err) => {
                this.snackBar.open('Error al crear ciclo lectivo', 'Cerrar', { duration: 3000 });
                console.error(err);
            }
        });
    }

    toggleExamTables(event: any) {
        const cycle = this.currentCycle();
        if (!cycle) return;

        const enabled = event.checked;
        this.cycleService.toggleExamTables(cycle.id, enabled).subscribe({
            next: () => {
                this.snackBar.open(`Mesas de examen ${enabled ? 'habilitadas' : 'deshabilitadas'}`, 'Cerrar', { duration: 3000 });
                this.currentCycle.update(c => ({ ...c, examTablesEnabled: enabled }));
            },
            error: (err) => {
                this.snackBar.open('Error al actualizar estado de mesas', 'Cerrar', { duration: 3000 });
                // Revert toggle if failed
                event.source.checked = !enabled;
                console.error(err);
            }
        });
    }
}
