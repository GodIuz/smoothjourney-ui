import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardStats } from '../models/dashboard.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  latestBusinesses: any[] = []; 

  recentUsers: any[] = [];
  
  constructor() { }

  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7000/Business/Stats';

  
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(this.apiUrl);
  }
}
