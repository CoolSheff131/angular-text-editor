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

  getTextById(id: string): Observable<any> {
    return this.http.get(`http://localhost:3000/text/${id}`, {
      responseType: 'text',
    });
  }

  updateTextById(id: string, title: string, content: string): Observable<any> {
    return this.http.patch(`http://localhost:3000/text/${id}`, {
      title,
      content,
    });
  }

  create(title: string, content: string) {
    return this.http.post(`http://localhost:3000/text`, { title, content });
  }

  getMine() {
    return this.http.get(`http://localhost:3000/text`);
  }
}
