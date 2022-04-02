import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private http: HttpClient) {}

  upload(file: File) {
    return new Promise((resolve, reject) => {
      if (
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/jpg'
      ) {
        // File types supported for image
        if (file.size < 1000000) {
          // Customize file size as per requirement

          // Sample API Call
          const uploadData = new FormData();
          uploadData.append('file', file, file.name);

          this.http
            .post('http://localhost:3000/image', uploadData)
            .toPromise()
            .then((result) => {
              resolve(''); // RETURN IMAGE URL from response
            })
            .catch((error) => {
              reject('Upload failed');
              // Handle error control
              console.error('Error:', error);
            });
        } else {
          reject('Size too large');
          // Handle Image size large logic
        }
      } else {
        reject('Unsupported type');
        // Handle Unsupported type logic
      }
    });
  }
}
