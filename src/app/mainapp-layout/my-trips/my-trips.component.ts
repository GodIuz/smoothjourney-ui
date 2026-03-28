import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Trip } from '../interfaces/trip.interface';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-my-trips',
  imports: [CommonModule, RouterModule],
  templateUrl: './my-trips.component.html',
  styleUrl: './my-trips.component.css',
})
export class MyTripsComponent implements OnInit {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  private apiUrl = 'https://localhost:7000';
  trips: Trip[] = [];
  isLoading: boolean = true;
  hasError: boolean = false;

  ngOnInit(): void {
    this.fetchMyTrips();
  }

  fetchMyTrips(): void {
    this.isLoading = true;
    this.hasError = false;

    this.http.get<Trip[]>(`${this.apiUrl}/Trips/my-trips`).subscribe({
      next: (data) => {
        this.trips = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Σφάλμα κατά τη φόρτωση των ταξιδιών:', err);
        this.toastService.showError(
          'Σφάλμα κατά τη φόρτωση των ταξιδιών. Παρακαλώ δοκιμάστε ξανά αργότερα.',
        );
        this.hasError = true;
        this.isLoading = false;
      },
    });
  }

  getTripStatus(startDate: Date): 'upcoming' | 'completed' {
    return new Date(startDate) > new Date() ? 'upcoming' : 'completed';
  }

  getImageUrl(path: string | undefined): string {
    if (!path) return 'assets/images/placeholder.jpg';
    if (path.startsWith('http')) return path;
    return `${this.apiUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  }
}
