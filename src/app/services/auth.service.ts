import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`http://localhost:3000/auth/login`, {
      email,
      password,
    });
  }

  register(fullname: string, email: string, password: string): Observable<any> {
    return this.http.post(`http://localhost:3000/auth/register`, {
      fullname,
      email,
      password,
    });
  }

  signOut() {
    localStorage.removeItem('token');
  }
}
