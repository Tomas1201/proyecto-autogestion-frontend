import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, throwError, BehaviorSubject, tap, catchError } from 'rxjs';

export interface Career {
  id: number;
  name: string;
  // Otros campos
}

export interface Subject {
  id: number;
  name: string;
  // Otros campos
}

export interface Professor {
  id: number;
  name: string;
  // Otros campos
}

export interface StudentI {
  id: number;
  name: string;
  lastName: string;
  email: string;
  file: number;
  dni: string;
  career: string[];
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class BackConnection {
  private apiUrl = 'http://localhost:3000/api/v1';

  private readonly endpoints = {
    careers: `${this.apiUrl}/career`,
    subjects: `${this.apiUrl}/subject`,
    professors: `${this.apiUrl}/professor`,
    students: `${this.apiUrl}/student`,
  };

  private handleError(error: any) {
    console.error('Error en la solicitud HTTP:', error);
    return throwError(() => new Error('Ocurrió un error en la comunicación con el servidor.'));
  }

  constructor(private http: HttpClient) { }

  private readonly _students = new BehaviorSubject<StudentI[]>([]);
  private readonly _professors = new BehaviorSubject<Professor[]>([]);
  private readonly _subjects = new BehaviorSubject<Subject[]>([]);
  private readonly _careers = new BehaviorSubject<Career[]>([]);

  public readonly students$: Observable<StudentI[]> = this._students.asObservable();
  public readonly professors$: Observable<Professor[]> = this._professors.asObservable();
  public readonly subjects$: Observable<Subject[]> = this._subjects.asObservable();
  public readonly careers$: Observable<Career[]> = this._careers.asObservable();

  public loadStudents(): Observable<StudentI[]> {

    const apiResponse$ = this.http.get<{ data: StudentI[] }>(this.endpoints.students);

    return apiResponse$.pipe(

      map(response => response.data),

      tap(studentsData => {
        this._students.next(studentsData);
        console.log(studentsData)
        console.log('Estudiantes cargados y guardados en el estado.');
      }),
      catchError(this.handleError)
    );
  }

  public loadProfessors(): Observable<Professor[]> {

    const apiResponse$ = this.http.get<{ data: Professor[] }>(this.endpoints.professors);

    return apiResponse$.pipe(

      map(response => response.data),

      tap(professorsData => {
        this._professors.next(professorsData);
        console.log('Profesores cargados y guardados en el estado.');
      }),
      catchError(this.handleError)
    );
  }

  public loadSubject(): Observable<Subject[]> {

    const apiResponse$: Observable<Subject[]> = this.http.get<Subject[]>(this.endpoints.subjects);

    return apiResponse$.pipe(

      tap(subjectData => {
        this._subjects.next(subjectData);
        console.log('Asignaturas cargadas y guardadas en el estado.');
      }),
      catchError(this.handleError)
    );
  }

  public loadCareers(): Observable<Career[]> {

    const apiResponse$: Observable<Career[]> = this.http.get<Career[]>(this.endpoints.careers);
    return apiResponse$.pipe(
      tap(careersData => {
        this._careers.next(careersData);
        console.log('Carerras cargadas y guardadas en el estado.');
      }),
      catchError(this.handleError)
    );
  }


  createCareer(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/career`, data);
  }

  getCareer(): Observable<any> {
    return this.http.get(`${this.apiUrl}/career`);
  }
  updateCareer(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/career/${id}`, data);
  }

  getByIdCareer(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/career/${id}`);
  }



  //Subjects
  getSubjects(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Subject`);
  }

  updateSubjects(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/Subject/${id}`, data);
  }

  getByIdSubjects(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/Subject/${id}`);
  }
  createSubject(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/subject/`, data);
  }

  //Professor
  getProfessor(): Observable<any> {
    return this.http.get(`${this.apiUrl}/professor/`);
  }
  updateProfessor(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/professor/${id}`, data);
  }
  getByIdProfessor(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/professor/${id}`);

  }
  createProfesor(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/professor/`, data);
  }

  //Students

  updateStudent(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/student/${id}`, data);
  }
  getByIdStudent(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/student/${id}`);
  }
  createStudent(data: any): Observable<any> {

    const apiResponse$ = this.http.post<{ data: StudentI[] }>(`${this.apiUrl}/student/`, data);


    return apiResponse$.pipe(

      map(response => response.data),

      tap(studentsData => {
        this._students.next(studentsData);
        console.log('Alumnos cargados y guardados en el estado.:' + this._students.value);
      }),
      catchError(this.handleError)
    );
  }
  // Student Panel Methods

  // Mock data for development since backend might not have these endpoints yet
  getStudentSubjects(studentId: number): Observable<any[]> {
    // In a real scenario: return this.http.get<any[]>(`${this.apiUrl}/student/${studentId}/subjects`);
    // Mocking for now based on existing subjects
    return this.subjects$.pipe(
      map(subjects => subjects.slice(0, 3)) // Return first 3 subjects as "enrolled"
    );
  }

  getStudentExams(studentId: number): Observable<any[]> {
    // Mocking exams
    return this.subjects$.pipe(
      map(subjects => subjects.map(s => ({
        ...s,
        examDate: new Date(new Date().setDate(new Date().getDate() + Math.floor(Math.random() * 30))),
        registered: false
      })))
    );
  }

  registerForExam(studentId: number, examId: number): Observable<any> {
    // return this.http.post(`${this.apiUrl}/student/${studentId}/exams/${examId}`, {});
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ success: true });
        observer.complete();
      }, 1000);
    });
  }

  getStudentGrades(studentId: number): Observable<any[]> {
    return this.subjects$.pipe(
      map(subjects => subjects.map(s => ({
        subject: s.name,
        firstPartial: Math.floor(Math.random() * 10) + 1,
        secondPartial: Math.floor(Math.random() * 10) + 1,
      })))
    );
  }

  getStudentAcademicStatus(studentId: number): Observable<any> {
    return new Observable(observer => {
      observer.next({
        average: 8.5,
        approvedSubjects: 12,
        totalSubjects: 40,
        status: 'Regular'
      });
      observer.complete();
    });
  }

  getStudentAttendance(studentId: number): Observable<any[]> {
    return this.subjects$.pipe(
      map(subjects => subjects.map(s => ({
        subject: s.name,
        attendance: Math.floor(Math.random() * 30) + 70 + '%'
      })))
    );
  }

  getStudyPlan(careerId: number): Observable<any[]> {
    return this.subjects$; // Assuming all subjects are part of the plan for now
  }

  // New methods for improvements

  getStudentCareers(studentId: number): Observable<Career[]> {
    // Mocking multiple careers
    return new Observable(observer => {
      observer.next([
        { id: 1, name: 'Ingeniería en Sistemas' },
        { id: 2, name: 'Tecnicatura en Programación' }
      ]);
      observer.complete();
    });
  }

  getAvailableSubjectsForRegistration(studentId: number, careerId: number): Observable<any[]> {
    // Mocking subjects available for registration (2nd year+)
    return this.subjects$.pipe(
      map(subjects => subjects.map((s, index) => ({
        ...s,
        year: (index % 3) + 1, // Mock year 1, 2, 3
        prerequisitesMet: Math.random() > 0.3 // Randomly fail prerequisites
      })).filter(s => s.year >= 2))
    );
  }

  registerForSubject(studentId: number, subjectId: number): Observable<any> {
    return new Observable(observer => {
      setTimeout(() => {
        // Simulate backend check
        if (Math.random() > 0.2) {
          observer.next({ success: true });
        } else {
          observer.error({ message: 'No cumples con las correlativas: Matemática I, Programación I' });
        }
        observer.complete();
      }, 1000);
    });
  }
}


















