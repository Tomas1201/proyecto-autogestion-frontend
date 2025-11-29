import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, tap, catchError, switchMap } from 'rxjs/operators';
import { Professor } from '../shared/models/professor.model';
import { ProfessorSubject } from '../shared/models/professor-subject.model';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProfessorService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'http://localhost:3000/api/v1';

  // State signals
  private _currentProfessor = signal<Professor | null>(null);
  private _professorSubjects = signal<ProfessorSubject[]>([]);

  private getProfessorId(): string {
    const user = this.authService.currentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    // Use entityId (Professor ID) if available, otherwise fallback to user ID (though this might fail if they are different)
    return user.entityId || user.id;
  }

  getCurrentProfessor(): Observable<{ data: Professor }> {
    const id = this.getProfessorId();
    return this.http.get<{ data: Professor }>(`${this.apiUrl}/professor/${id}`).pipe(
      tap(p => this._currentProfessor.set(p.data)),
      catchError((err) => {
        console.error('Error fetching professor profile', err);
        return throwError(() => err);
      })
    );
  }

  getProfessorSubjects(): Observable<ProfessorSubject[]> {
    const id = this.getProfessorId();
    return this.http.get<{ data: any[] }>(`${this.apiUrl}/professor/${id}/subjects`).pipe(
      map(response => response.data.map(item => ({
        id: item.id,
        subjectId: item.subjectId,
        professorId: item.professorId,
        role: item.role,
        schedule: item.schedule,
        subjectName: item.subjectName
      }))),
      tap(s => this._professorSubjects.set(s)),
      catchError((err) => {
        console.error('Error fetching subjects', err);
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
      catchError((err) => {
        console.error('Error fetching students', err);
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
    const id = this.getProfessorId();
    return this.http.put(`${this.apiUrl}/professor/${id}`, {
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
