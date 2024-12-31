import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import api from '../common/api';
import { AuthResponse, LoginData, RegisterData, User } from '../models';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = this.getFromLocalStorage('user');
    const storedToken = this.getFromLocalStorage('token');

    if (storedUser && storedToken) {
      this.currentUserSubject.next(JSON.parse(storedUser));
      this.tokenSubject.next(storedToken);
    }
  }

  login(loginData: LoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(api.SignIn.url, loginData, {
      withCredentials: true
    }).pipe(
      tap(response => {
        this.setAuthData(response);
      })
    );
  }

  logout(): Observable<any> {
    this.removeFromLocalStorage('token');
    this.removeFromLocalStorage('user');
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
    return this.http.post(api.SignOut.url,{});
  }
  register(registerData: RegisterData): Observable<any> {
    return this.http.post(api.SignUp.url, registerData);
  }

  isAuthenticated(): boolean {
    return !!this.tokenSubject.value;
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  private setAuthData(response: AuthResponse): void {
    this.setToLocalStorage('token', response.token);
    this.setToLocalStorage('user', JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
    this.tokenSubject.next(response.token);
  }

  private setToLocalStorage(key: string, value: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(key, value);
    }
  }

  private getFromLocalStorage(key: string): string | null {
    return this.isBrowser() ? localStorage.getItem(key) : null;
  }

  private removeFromLocalStorage(key: string): void {
    if (this.isBrowser()) {
      localStorage.removeItem(key);
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
