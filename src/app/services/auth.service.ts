import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'https://localhost:7000/Auth';
  public username$ = new BehaviorSubject<string>(this.getUserNameFromStorage());

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  register(userObj: any) {
    return this.http.post<any>(`${this.baseUrl}/register`, userObj);
  }

  login(loginObj: any) {
    return this.http.post<any>(`${this.baseUrl}/login`, loginObj);
  }

  private getUserNameFromStorage(): string {
    return localStorage.getItem('userName') || 'Επισκέπτης';
  }

  setUsername(name: string) {
    localStorage.setItem('userName', name);
    this.username$.next(name);
  }

  forgotPassword(email: string) {
    return this.http.post<any>(`${this.baseUrl}/forgot-password`, {
      email: email,
    });
  }

  verifyEmail(token: string) {
    return this.http.post<any>(`${this.baseUrl}/verify`, { token: token });
  }

  storeToken(token: string, rememberMe: boolean) {
    if (rememberMe) {
      localStorage.setItem('token', token);
    } else {
      sessionStorage.setItem('token', token);
    }
  }

  getToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  resetPassword(token: string, newPassword: string) {
    const resetObj = {
      token: token,
      newPassword: newPassword,
    };
    return this.http.post<any>(`${this.baseUrl}/reset-password`, resetObj);
  }

  refreshToken(payload: { refreshToken: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/refresh-token`, payload);
  }
}
