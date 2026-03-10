import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Business {
  [x: string]: any;
  id: number;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviews: number;
  image: string;
  priceLevel: string;
}

@Injectable({
  providedIn: 'root',
})
export class BusinessService {
  private apiUrl = 'https://localhost:7000';

  constructor(private http: HttpClient) {}

  getTopBusinesses(): Observable<Business[]> {
    return this.http.get<Business[]>(`${this.apiUrl}/Business/top-rated`);
  }

  getFeaturedAccommodations(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/Business/accommodation/featured`,
    );
  }

  getAllBusinesses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Business/all`);
  }

  createBusiness(data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/Business/create-business`, data);
  }

  deleteBusiness(id: number) {
    return this.http.delete(`${this.apiUrl}/Business/${id}`);
  }

  getById(id: number) {
    return this.http.get<any>(`${this.apiUrl}/Business/${id}`);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/Business/${id}`);
  }

  toggleFavorite(businessId: number) {
    return this.http.post(`${this.apiUrl}/Favourites/toggle/${businessId}`, {});
  }

  getMyFavorites() {
    return this.http.get<any[]>(`${this.apiUrl}/Favourites`);
  }

  getFavoriteIds() {
    return this.http.get<number[]>(`${this.apiUrl}/Favourites/ids`);
  }
}
