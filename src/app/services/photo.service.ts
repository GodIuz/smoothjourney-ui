import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UploadResponse {
  url: string;
}

@Injectable({
  providedIn: 'root'
})

export class PhotoService {

  private apiUrl = 'https://localhost:7000/Image'; 
  private http = inject(HttpClient);
  
  uploadPhoto(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<UploadResponse>(`${this.apiUrl}/upload-photo`, formData);
  }
}