import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewServiceService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7000/Reviews';

  getAllReviews(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  deleteReview(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
