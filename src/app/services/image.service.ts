import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private http: HttpClient) {}

  upload(file: File) {
    return new Promise((resolve, reject) => {
      console.log('UPLOADING');
      if (
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/jpg'
      ) {
        // File types supported for image
        //if (file.size < 1000000) {
        const uploadData = new FormData();
        uploadData.append('file', file, file.name);
        console.log('sending');
        this.http
          .post('http://localhost:3000/text/upload', uploadData)
          .toPromise()
          .then((result: any) => {
            resolve(result.url); // RETURN IMAGE URL from response
          })
          .catch((error) => {
            reject('Upload failed');
            // Handle error control
            console.error('Error:', error);
          });
        // } else {
        //   reject('Size too large');
        //   // Handle Image size large logic
        // }
      } else {
        reject('Unsupported type');
        // Handle Unsupported type logic
      }
    });
  }
}
