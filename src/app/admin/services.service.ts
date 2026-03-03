import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'https://localhost:7000';

  constructor(private http: HttpClient) { }
  
  updateBusiness(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/Business/Update/${id}`, data);
  }
}