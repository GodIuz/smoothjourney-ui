import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'https://localhost:7000/Auth';
  public username$ = new BehaviorSubject<string>(this.getUserNameFromStorage());
  private http = inject(HttpClient);
  private router = inject(Router);

  register(userObj: any) {
    return this.http.post<any>(`${this.baseUrl}/register`, userObj);
  }

  login(loginObj: any) {
    return this.http.post<any>(`${this.baseUrl}/login`, loginObj);
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

  resetPassword(token: string, newPassword: string) {
    const resetObj = {
      token: token,
      newPassword: newPassword,
    };
    return this.http.post<any>(`${this.baseUrl}/reset-password`, resetObj);
  }

  private getUserNameFromStorage(): string {
    return localStorage.getItem('userName') || 'Επισκέπτης';
  }

  getToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  getRoleFromToken(): string {
    const token = this.getToken();
    if (!token) return '';

    try {
      const payloadBase64 = token.split('.')[1];
      const decodedJson = atob(payloadBase64);
      const parsedData = JSON.parse(decodedJson);
      const role =
        parsedData['role'] ||
        parsedData[
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ];

      return role || 'User';
    } catch (error) {
      console.error('Σφάλμα κατά την αποκωδικοποίηση του token:', error);
      return '';
    }
  }

  getRefreshToken() {
    return (
      localStorage.getItem('refreshToken') ||
      sessionStorage.getItem('refreshToken')
    );
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('refreshToken');
    localStorage.removeItem('userName');
    this.username$.next('Επισκέπτης');
    this.router.navigate(['/login']);
  }

  refreshToken(p0: { refreshToken: string }): Observable<any> {
    const payload = {
      token: this.getToken(),
      refreshToken: this.getRefreshToken(),
    };
    return this.http.post<any>(`${this.baseUrl}/refresh-token`, payload);
  }
}
