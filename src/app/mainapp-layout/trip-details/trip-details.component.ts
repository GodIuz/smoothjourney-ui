import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-trip-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './trip-details.component.html',
  styleUrl: './trip-details.component.css',
})
export class TripDetailsComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);
  private apiUrl = 'https://localhost:7000';

  trip: any = null;
  isLoading: boolean = true;
  hasError: boolean = false;

  ngOnInit(): void {
    const tripName = this.route.snapshot.paramMap.get('name');
    if (tripName) {
      this.fetchTripDetails(tripName);
    }
  }

  fetchTripDetails(name: string): void {
    this.isLoading = true;
    this.hasError = false;

    this.http.get<any[]>(`${this.apiUrl}/Trips/my-trips`).subscribe({
      next: (trips) => {
        const decodedName = decodeURIComponent(name).toLowerCase();

        this.trip = trips.find(
          (t) =>
            (t.destination && t.destination.toLowerCase() === decodedName) ||
            (t.title && t.title.toLowerCase() === decodedName),
        );

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Σφάλμα κατά τη φόρτωση λεπτομερειών:', err);
        this.toastService.showError('Σφάλμα κατά τη φόρτωση λεπτομερειών.');
        this.hasError = true;
        this.isLoading = false;
      },
    });
  }

  getActivitiesByDay(trip: any): any[] {
    if (!trip || !trip.activities || trip.activities.length === 0) return [];

    const grouped = trip.activities.reduce((acc: any[], current: any) => {
      const dayGroup = acc.find((item) => item.day === current.day);
      if (dayGroup) {
        dayGroup.activities.push(current);
      } else {
        acc.push({ day: current.day, activities: [current] });
      }
      return acc;
    }, []);

    return grouped.sort((a: any, b: any) => a.day - b.day);
  }

  getImageUrl(path: string | undefined): string {
    if (!path) return 'assets/images/placeholder.jpg';
    if (path.startsWith('http')) return path;
    return `${this.apiUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  }
}
