import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private readonly http: HttpClient) {}

  getMe(): Observable<User> {
    return this.http.get<User>(`http://localhost:3000/user/me`);
  }

  uploadAvatar(formData) {
    return this.http.post('http://localhost:3000/user/uploadAvatar', formData);
  }

  deleteAvatar() {
    return this.http.delete('http://localhost:3000/user/deleteAvatar');
  }
}
