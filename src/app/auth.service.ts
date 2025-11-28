import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export enum UserRole {
  Admin = 'admin',
  Student = 'student',
  Professor = 'professor'
}

export interface User {
  id: number;
  name: string;
  role: UserRole;
  email?: string;
  fileNumber?: string; // Legajo
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/v1/Login';

  // Signals for reactive state
  currentUser = signal<User | null>(null);
  isLoggedIn = computed(() => !!this.currentUser());
  userRole = computed(() => this.currentUser()?.role);

  constructor(private http: HttpClient) {
    this.checkCookie();
  }

  login(identifier: string, password: string): Observable<any> {
    // Mocking the backend response
    return this.mockLogin(identifier, password).pipe(
      tap(response => {
        if (response.token) {
          this.setCookie('auth_token', response.token, 1); // 1 day expiration
          this.decodeTokenAndSetUser(response.token);
        }
      })
    );
  }

  logout() {
    this.deleteCookie('auth_token');
    this.currentUser.set(null);
  }

  private mockLogin(identifier: string, password: string): Observable<any> {
    // Simulate network delay
    return of(null).pipe(
      delay(500),
      tap(() => {
        // Mock validation
        if (identifier === 'admin@test.com' && password === 'admin123') {
          return;
        } else if (identifier === '12345' && password === 'student123') {
          return;
        } else if (identifier === 'prof@test.com' && password === 'prof123') {
          return;
        } else {
          throw new Error('Credenciales inválidas');
        }
      }),
      tap(() => { }), // Just to allow the error to propagate if thrown above
      // Return success with a mock token containing the role
      tap(() => { }),
      // We need to return an observable with the token
      () => {
        let role = UserRole.Student;
        let id = 1;
        if (identifier.includes('@')) {
          if (identifier.startsWith('admin')) role = UserRole.Admin;
          else role = UserRole.Professor;
        }

        // Mock JWT: header.payload.signature
        const payload = btoa(JSON.stringify({
          id,
          role,
          name: role === UserRole.Student ? 'Juan Perez' : 'Admin User',
          identifier
        }));
        return of({ token: `mock.jwt.${payload}` });
      }
    );
  }

  // Helper to simulate JWT decoding
  private decodeTokenAndSetUser(token: string) {
    try {
      const payload = token.split('.')[2]; // In our mock it's the 3rd part, usually 2nd
      const decoded = JSON.parse(atob(payload));
      this.currentUser.set({
        id: decoded.id,
        name: decoded.name,
        role: decoded.role,
        email: decoded.identifier.includes('@') ? decoded.identifier : undefined,
        fileNumber: !decoded.identifier.includes('@') ? decoded.identifier : undefined
      });
    } catch (e) {
      console.error('Error decoding token', e);
    }
  }

  // Cookie helpers
  private setCookie(name: string, value: string, days: number) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  private getCookie(name: string) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  private deleteCookie(name: string) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  private checkCookie() {
    const token = this.getCookie('auth_token');
    if (token) {
      this.decodeTokenAndSetUser(token);
    }
  }
}
