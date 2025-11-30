import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, throwError, BehaviorSubject, tap, catchError, of } from 'rxjs';

export interface Career {
  id: string;
  name: string;
  duration: number; 
  description: string; 
  subjects: CareerSubjectDetail[]
}
export interface CareerSubjectDetail {
  id: any;                
  name: string;           
  year: number;           
  correlativeId: any | null; 
  correlativeName?: string; 
}

export interface Subject {
  id: string;
  name: string;
  
}

export interface Professor {
  id: string;
  name: string;
  
}

export interface StudentI {
  id: string;
  name: string;
  lastName: string;
  email: string;
  file: string;
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

    const apiResponse$ = this.http.get<{ data: StudentI[] }>(this.endpoints.students, { withCredentials: true });

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

    const apiResponse$ = this.http.get<{ data: Professor[] }>(this.endpoints.professors, { withCredentials: true });

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

    const apiResponse$: Observable<Subject[]> = this.http.get<Subject[]>(this.endpoints.subjects, { withCredentials: true });

    return apiResponse$.pipe(

      tap(subjectData => {
        this._subjects.next(subjectData);
        console.log('Asignaturas cargadas y guardadas en el estado.');
      }),
      catchError(this.handleError)
    );
  }

  public loadCareers(): Observable<Career[]> {

    const apiResponse$: Observable<Career[]> = this.http.get<Career[]>(this.endpoints.careers, { withCredentials: true });
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
  createProfessor(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/professor/`, data);
  }

  assignProfessorToSubject(professorId: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/professor/registerToSubject/${professorId}`, data);
  }

  //Students

  updateStudent(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/student/${id}`, data);
  }
  getByIdStudent(id: string): Observable<any> {
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

  assignStudentToSubject(studentId: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/student/registerToSubject/${studentId}`, data);
  }

  // Student Panel Methods

  getStudentCareers(studentId: string): Observable<Career[]> {
    return this.http.get<{ status: string, data: Career[] }>(`${this.apiUrl}/student-panel/careers/${studentId}`, { withCredentials: true })
      .pipe(map(res => res.data));
  }

  getAvailableSubjectsForRegistration(studentId: string, careerId: string): Observable<any[]> {
    // Backend infers student from token and active career
    return this.http.get<{ status: string, data: any[] }>(`${this.apiUrl}/student-panel/available-subjects`, { withCredentials: true })
      .pipe(map(res => res.data));
  }

  registerForSubject(studentId: string, subjectId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/student-panel/register-subject/${studentId}/subjectId/${subjectId}`, { withCredentials: true });
  }

  getStudentAttendance(studentId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/student-panel/attendance/${studentId}`, { withCredentials: true });
  }

  getStudentGrades(studentId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/student-panel/grades/${studentId}`, { withCredentials: true });
  }

  getStudentExams(studentId: string): Observable<any[]> {
    // This maps to available final exams
    return this.http.get<any[]>(`${this.apiUrl}/student-panel/final-exams/${studentId}`, { withCredentials: true });
  }

  registerForExam(studentId: string, finalExamId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/student-panel/register-final-exam/${studentId}/finalExamId/${finalExamId}`, { withCredentials: true });
  }

  getStudentSubjects(studentId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/student-panel/subjects/${studentId}`, { withCredentials: true });
  }

  getStudentAcademicStatus(studentId: string): Observable<any> {
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

  getStudyPlan(careerId: string): Observable<any[]> {
    return this.subjects$;
  }
}
