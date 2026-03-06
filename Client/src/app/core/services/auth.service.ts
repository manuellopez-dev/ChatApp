import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environments';

export interface User {
  id:       number;
  username: string;
  email:    string;
  avatar:   string;
}

export interface AuthResponse {
  token: string;
  user:  User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) {}

  register(data: { username: string; email: string; password: string; avatar: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(res => this.saveSession(res))
    );
  }

  login(data: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(res => this.saveSession(res))
    );
  }

  saveSession(res: AuthResponse): void {
    localStorage.setItem('token', res.token);
    localStorage.setItem('user',  JSON.stringify(res.user));
  }

  getToken(): string | null  { return localStorage.getItem('token'); }
  getUser():  User | null    {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }
  isLoggedIn(): boolean { return !!this.getToken(); }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/auth/login']);
  }
}