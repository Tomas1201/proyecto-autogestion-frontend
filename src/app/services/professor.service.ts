import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Professor } from '../shared/models/professor.model';
import { ProfessorSubject } from '../shared/models/professor-subject.model';

@Injectable({
  providedIn: 'root',
})
export class ProfessorService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/v1';

  // State signals
  private _currentProfessor = signal<Professor | null>(null);
  private _professorSubjects = signal<ProfessorSubject[]>([]);

  // Mock ID for development (should come from auth)
  private readonly MOCK_PROFESSOR_ID = '123e4567-e89b-12d3-a456-426614174000'; 

  getCurrentProfessor(): Observable<Professor> {
    // In a real app, this would get the logged-in user's profile
    // For now, we fetch a specific professor by ID or use a mock endpoint
    return this.http.get<Professor>(`${this.apiUrl}/professor/${this.MOCK_PROFESSOR_ID}`).pipe(
      tap(p => this._currentProfessor.set(p)),
      catchError(() => {
        // Fallback to mock if backend fails
        const mockProfessor: Professor = {
          id: this.MOCK_PROFESSOR_ID,
          name: 'Roberto',
          lastName: 'Gómez',
          dni: '12345678',
          email: 'roberto.gomez@university.edu',
          phone: '555-1234',
          file: 'PROF-2024-001',
          academicTitle: 'Ingeniero',
          scheduleAvailability: 'Lunes a Viernes, 18:00 - 22:00',
          state: true,
        };
        this._currentProfessor.set(mockProfessor);
        return of(mockProfessor);
      })
    );
  }

  getProfessorSubjects(): Observable<ProfessorSubject[]> {
    return this.http.get<{data: any[]}>(`${this.apiUrl}/professor/${this.MOCK_PROFESSOR_ID}/subjects`).pipe(
      map(response => response.data.map(item => ({
        id: item.id,
        subjectId: item.subjectId,
        professorId: item.professorId,
        role: item.role,
        schedule: item.schedule,
        subjectName: item.subjectName
      }))),
      tap(s => this._professorSubjects.set(s)),
      catchError(() => {
        console.error('Error fetching subjects');
        return of([]);
      })
    );
  }

  getNextClass(): Observable<ProfessorSubject | null> {
    const subjects = this._professorSubjects();
    return of(subjects.length > 0 ? subjects[0] : null);
  }

  // New methods for features using Real Backend
  getStudentsBySubject(subjectId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/registrations/subject/${subjectId}`).pipe(
      catchError(() => {
        console.error('Error fetching students');
        return of([]);
      })
    );
  }

  updateStudentStatus(registrationId: string, newStatus: string, newGrade?: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/registrations/${registrationId}`, {
      status: newStatus,
      grade: newGrade
    });
  }

  updateAvailability(availability: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/professor/${this.MOCK_PROFESSOR_ID}`, {
      scheduleAvailability: availability
    });
  }

  // Attendance
  getAttendance(subjectId: string, date: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/attendance/subject/${subjectId}/date/${date}`).pipe(
      catchError(() => of([]))
    );
  }

  saveAttendance(subjectId: string, date: string, students: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/attendance`, {
      subjectId,
      date,
      students
    });
  }

  // Final Exams
  getFinalExams(subjectId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/final-exams/subject/${subjectId}`).pipe(
      catchError(() => of([]))
    );
  }

  getExamRegistrations(finalExamId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/final-exams/${finalExamId}/registrations`).pipe(
      catchError(() => of([]))
    );
  }

  updateExamGrade(registrationId: number, grade: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/final-exams/registrations/${registrationId}`, {
      grade,
      status
    });
  }

  createFinalExam(exam: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/final-exams`, exam);
  }
}
