import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable, catchError, throwError } from 'rxjs';

type CloudinaryUploadResponse = {
  secure_url: string;
  public_id: string;
};

@Injectable({ providedIn: 'root' })
export class CloudinaryService {
  private endpoint = `https://api.cloudinary.com/v1_1/${environment.cloudinary.cloudName}/image/upload`;

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<{ url: string; publicId: string }> {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', environment.cloudinary.uploadPreset);
    fd.append('folder', 'programadores'); // opcional

    return this.http.post<CloudinaryUploadResponse>(this.endpoint, fd).pipe(
      map((res) => ({ url: res.secure_url, publicId: res.public_id })),
      catchError((e) => {
        console.error('CLOUDINARY ERROR FULL:', e);
        console.error('STATUS:', e?.status);
        console.error('ERROR BODY:', e?.error);
        return throwError(() => e);
      })
    );
  }
}
