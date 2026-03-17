import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = environment.apiUrl;
    private currentUserSubject = new BehaviorSubject<any>(this.getStoredUser());

    currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) { }

    register(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/register`, data);
    }

    login(email: string, password: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
            tap(response => {
                if (response.token) {
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('role', response.role);
                    localStorage.setItem('fullName', response.fullName);
                    localStorage.setItem('userId', response.userId.toString());
                    this.currentUserSubject.next({
                        token: response.token,
                        role: response.role,
                        fullName: response.fullName,
                        userId: response.userId
                    });
                }
            })
        );
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('fullName');
        localStorage.removeItem('userId');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    getRole(): string | null {
        return localStorage.getItem('role');
    }

    getUserId(): number | null {
        const id = localStorage.getItem('userId');
        return id ? parseInt(id) : null;
    }

    getFullName(): string {
        return localStorage.getItem('fullName') || '';
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    hasRole(role: string): boolean {
        return this.getRole() === role;
    }

    private getStoredUser(): any {
        const token = localStorage.getItem('token');
        if (token) {
            return {
                token,
                role: localStorage.getItem('role'),
                fullName: localStorage.getItem('fullName'),
                userId: localStorage.getItem('userId')
            };
        }
        return null;
    }
}
