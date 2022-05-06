import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedText } from '../main/main.component';
import { Permission } from '../models/permission.model';
import { Text } from '../models/text.model';

export interface Config {
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class TextService {
  public text!: Text;
  public textId!: string;
  search(searchedTitle: string) {
    return this.http.get<SharedText[]>(
      `http://localhost:3000/text/search/${searchedTitle}`
    );
  }
  constructor(private http: HttpClient) {}

  uploadImage(file: File) {
    return new Promise((resolve, reject) => {
      if (
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/jpg'
      ) {
        const uploadData = new FormData();
        uploadData.append('file', file, file.name);
        this.http
          .post('http://localhost:3000/text/upload', uploadData)
          .toPromise()
          .then((result: any) => {
            resolve(result.url);
          })
          .catch((error) => {
            reject('Upload failed');
            console.error('Error:', error);
          });
      } else {
        reject('Unsupported type');
      }
    });
  }

  getTextById(id: string): Observable<any> {
    this.textId = id;
    return this.http.get(`http://localhost:3000/text/${id}`, {
      responseType: 'text',
    });
  }
  getTextByIdToEdit(id: string): Observable<any> {
    return this.http.get(`http://localhost:3000/text/${id}/edit`, {
      responseType: 'text',
    });
  }

  updateTextPreviewById(id: string, preview: Blob) {
    const uploadData = new FormData();
    uploadData.append('file', preview, 'preview');

    return this.http.post(
      `http://localhost:3000/text/${id}/preview`,
      uploadData
    );
  }

  updateTextById(id: string, title: string, content: string): Observable<any> {
    return this.http.patch(`http://localhost:3000/text/${id}`, {
      title,
      content,
    });
  }

  deleteById(id: string) {
    return this.http.delete(`http://localhost:3000/text/${id}`);
  }

  create(title: string, content: string) {
    return this.http.post(`http://localhost:3000/text`, { title, content });
  }

  share(textId: string, permission: Permission) {
    return this.http.post(`http://localhost:3000/right-assignment-tokens`, {
      textId,
      permission,
    });
  }

  getSingleSharedLinks(textId: string) {
    return this.http.get(
      `http://localhost:3000/right-assignment-tokens/text/${textId}`
    );
  }

  activateToken(token: string) {
    return this.http.get(
      `http://localhost:3000/right-assignment-tokens/activate/${token}`
    );
  }

  deleteUserPermission(idPermission: string) {
    return this.http.delete(
      `http://localhost:3000/permissions/${idPermission}`
    );
  }

  getPermissions(textId: string) {
    return this.http.get(`http://localhost:3000/permissions/text/${textId}`);
  }

  deleteToken(id: string) {
    return this.http.delete(
      `http://localhost:3000/right-assignment-tokens/${id}`
    );
  }

  getMine() {
    return this.http.get<SharedText[]>(`http://localhost:3000/text`);
  }
  getShared() {
    return this.http.get<SharedText[]>(`http://localhost:3000/text/shared`);
  }
}
