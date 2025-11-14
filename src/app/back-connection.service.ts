import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class BackConnection {
  private apiUrl = 'http://localhost:3000/api/v1'; 

  constructor(private http: HttpClient) { }

 createCareer(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/career`, data);
  }

  getCareer(): Observable<any> {
    return this.http.get(`${this.apiUrl}/career`);
  }
  updateCareer(id:number, data:any): Observable<any> {
    return this.http.put(`${this.apiUrl}/career/${id}`,data);
  }

  getByIdCareer(id:number): Observable<any> {
    return this.http.get(`${this.apiUrl}/career/${id}`);
  }



  //Subjects
  getSubjects(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Subject`);  }
  
  updateSubjects(id:number, data:any): Observable<any> {
    return this.http.put(`${this.apiUrl}/Subject/${id}:`,data);
  }
  
  getByIdSubjects(id:number): Observable<any> {
    return this.http.get(`${this.apiUrl}/Subject/${id}`);
  } 
  createSubject(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/subject/`, data);
  }

  //Professor
  getProfessor(): Observable<any> {
    return this.http.get(`${this.apiUrl}/professor`);
  }
  updateProfessor(id:number, data:any): Observable<any> {
    return this.http.put(`${this.apiUrl}/professor/${id}:`,data);
  } 
  getByIdProfessor(id:number): Observable<any> {
    return this.http.get(`${this.apiUrl}/professor/${id}`);
    
  }
  createProfesor(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/professor/`, data);
  }

  //Students
  getStudents(): Observable<any> {
    return this.http.get(`${this.apiUrl}/students`);
  }
  updateStudents(id:number, data:any): Observable<any> {
    return this.http.put(`${this.apiUrl}/students/${id}:`,data);
  } 
  getByIdStudents(id:number): Observable<any> {
    return this.http.get(`${this.apiUrl}/students/${id}`);
  }
  createStudent(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/students/`, data);
  }
}


/*OTRA OPCION PARA MEJORAR EL CODIGO:

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BackConnection {
  // Mantienes la URL base.
  private apiUrl = 'http://localhost:3000/api/v1'; 

  constructor(private http: HttpClient) { }

  /**
   * Método GET: Obtiene una lista de recursos o un recurso específico.
   * @param endpoint - El nombre del recurso (ej: 'students', 'professors').
   * @param id - (Opcional) El ID para obtener un recurso individual.
   
  public getAll<T>(endpoint: string, id?: number | string): Observable<T> {
    const url = id ? `${this.apiUrl}/${endpoint}/${id}` : `${this.apiUrl}/${endpoint}`;
    // Usamos <T> para tipar la respuesta.
    return this.http.get<T>(url); 
  }

  /**
   * Método POST: Crea un nuevo recurso.
   * @param endpoint - El nombre del recurso (ej: 'students').
   * @param data - Los datos del nuevo recurso a crear.
   
  public create<T>(endpoint: string, data: any): Observable<T> {
    const url = `${this.apiUrl}/${endpoint}`;
    return this.http.post<T>(url, data);
  }

  
   * Método PUT: Actualiza un recurso existente.
   * @param endpoint - El nombre del recurso (ej: 'students').
   * @param id - El ID del recurso a actualizar.
   * @param data - Los datos a actualizar.
   
  public update<T>(endpoint: string, id: number | string, data: any): Observable<T> {
    const url = `${this.apiUrl}/${endpoint}/${id}`;
    return this.http.put<T>(url, data);
  }

  /**
   * Método DELETE: Elimina un recurso.
   * @param endpoint - El nombre del recurso (ej: 'students').
   * @param id - El ID del recurso a eliminar.
   
  public delete<T>(endpoint: string, id: number | string): Observable<T> {
    const url = `${this.apiUrl}/${endpoint}/${id}`;
    return this.http.delete<T>(url);
  }
    
  
  
  Implementacion:
  import { Component, OnInit } from '@angular/core';
import { BackConnection } from './back-connection.service';

// Sugerencia: Define una interfaz para tipar mejor los datos
interface Student {
  id: number;
  name: string;
  // ... otras propiedades
}

@Component({
  // ...
})
export class StudentComponent implements OnInit {
  // Inyectas el servicio
  constructor(private backConnection: BackConnection) {}

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    // 1. OBTENER todos los estudiantes
    this.backConnection.getAll<Student[]>('students').subscribe(students => {
      console.log('Lista de Estudiantes:', students);
    });
  }

  createStudent() {
    const newStudentData = { name: 'Juan Perez', age: 20 };
    
    // 2. CREAR un nuevo estudiante
    this.backConnection.create<Student>('students', newStudentData).subscribe(response => {
      console.log('Estudiante Creado:', response);
    });
  }

  updateStudent(studentId: number) {
    const updatedData = { name: 'Pedro Alvares' };

    // 3. ACTUALIZAR un estudiante
    this.backConnection.update<Student>('students', studentId, updatedData).subscribe(response => {
      console.log('Estudiante Actualizado:', response);
    });
  }
}
  
  
  
  
  
  */


















