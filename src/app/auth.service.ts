import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export enum UserRole {
  Admin = 'ADMIN',
  Student = 'STUDENT',
  Professor = 'PROFESSOR'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
  fileNumber?: string; 
  entityId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/v1/auth/login';

  
  currentUser = signal<User | null>(null);
  isLoggedIn = computed(() => !!this.currentUser());

  
  userRole = computed(() => this.currentUser()?.role);

  constructor(private http: HttpClient) {
    this.checkCookie();
  }

  login(identifier: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}`, { file: identifier, password }, { withCredentials: true }).pipe(
      tap((response: any) => {
        console.log('Login response received:', response);

        
        const token = response.jwt_token || response.data?.jwt_token || response.token;

        if (token) {
          this.decodeTokenAndSetUser(token);
        } else {
          console.log('Token not in body, checking cookies...');
          this.checkCookie();
        }
      })
    );
  }

  register(file: string, password: string, role: string): Observable<any> {
    role = role.toUpperCase();
    const registerUrl = this.apiUrl.replace('/login', '/register');
    return this.http.post(registerUrl, { file, password, role });
  }

  logout() {
    this.currentUser.set(null);
    this.deleteCookie('jwt_auth');
    window.location.href = '/login';
  }

  
  private decodeTokenAndSetUser(token: string) {
    try {
      const payload = this.decodeJwtPayload(token);

      let role = UserRole.Student;
      if (payload.role === 'ADMIN') role = UserRole.Admin;
      else if (payload.role === 'PROFESSOR') role = UserRole.Professor;
      else if (payload.role === 'STUDENT') role = UserRole.Student;

      this.currentUser.set({
        id: payload.userid,
        name: 'User',
        role: role,
        fileNumber: payload.file,
        entityId: payload.entityId 
      });

      console.log('User set from token:', this.currentUser());
    } catch (e) {
      console.error('Error decoding token', e);
    }
  }

  private decodeJwtPayload(token: string): any {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT token structure');
    }

    let base64Url = parts[1];
    
    while (base64Url.length % 4) {
      base64Url += '=';
    }

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  
  private getCookie(key: string): string | null {
    const cookies = document.cookie
      .split(";")
      .map(cookie => cookie.trim());
    console.log('Cookies found:', cookies);

    for (const cookie of cookies) {
      const [name, ...rest] = cookie.split("=");
      console.log('Cookie found:', name, rest.join("="));
      if (name === key) {
        console.log('Cookie found:', name, rest.join("="));
        
        return decodeURIComponent(rest.join("="));
      }
    }

    return null;
  }

  private deleteCookie(name: string) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  private checkCookie() {
    const token = this.getCookie('jwt_auth');
    console.log('Token found in cookie1:', token);
    if (token) {
      console.log('Token found in cookie:', token);
      this.decodeTokenAndSetUser(token);
    }
  }
}
