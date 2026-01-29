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
  providedIn: 'root'
})
export class BusinessService {
  private apiUrl = 'https://localhost:7000/Business'; 

  possibleBadges = ['Best for Couples', 'Solo Traveler Pick', 'Luxury & Spa', 'Budget Friendly', 'Top Location', 'Sunset View'];
  
  possibleSummaries = [
    'Εξαιρετική τοποθεσία κοντά στο κέντρο. Οι επισκέπτες λατρεύουν το πρωινό και την καθαριότητα.',
    'Ιδανικό για χαλάρωση. Ησυχία, άνετα κρεβάτια και πολύ φιλικό προσωπικό.',
    'Μοντέρνα αισθητική και γρήγορο WiFi. Τέλεια επιλογή για digital nomads.',
    'Μαγευτική θέα και ρομαντική ατμόσφαιρα. Λίγο ακριβό, αλλά αξίζει κάθε ευρώ.'
  ];

  constructor(private http: HttpClient) { }

  getTopBusinesses(): Observable<Business[]> {
    return this.http.get<Business[]>(`${this.apiUrl}/top-rated`);
  }

  getFeaturedAccommodations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/accommodation/featured`);
  }

 getAllBusinesses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  createBusiness(data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-business`, data);
  }

  deleteBusiness(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getById(id: number) { return this.http.get<any>(`${this.apiUrl}/${id}`); }

  update(id: number, data: any) { return this.http.put(`${this.apiUrl}/${id}`, data); }

  delete(id: number) { return this.http.delete(`${this.apiUrl}/${id}`); }
  
}