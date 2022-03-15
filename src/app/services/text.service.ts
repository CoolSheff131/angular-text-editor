import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Config {
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class TextService {
  constructor(private http: HttpClient) {}

  getTextData(id: string): Observable<any> {
    return this.http.get(`http://localhost:3000/${id}`, {
      responseType: 'text',
    });
  }
}
