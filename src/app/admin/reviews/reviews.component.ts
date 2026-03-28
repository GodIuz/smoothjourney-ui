import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css',
})
export class ReviewsComponent implements OnInit {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  reviews = signal<any[]>([]);
  isLoading = signal(true);

  private apiUrl = 'https://localhost:7000/Reviews';

  ngOnInit() {
    this.loadReviews();
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  loadReviews() {
    this.isLoading.set(true);
    const headers = this.getAuthHeaders();

    this.http.get<any[]>(`${this.apiUrl}/all-reviews`, { headers }).subscribe({
      next: (data) => {
        console.log('📦 Reviews loaded:', data);
        this.reviews.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Σφάλμα κατά τη φόρτωση των κριτικών:', err);
        this.isLoading.set(false);
      },
    });
  }

  deleteReview(id: number) {
    if (
      confirm(
        'Προσοχή! Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την κριτική;',
      )
    ) {
      const headers = this.getAuthHeaders();

      this.http
        .delete(`${this.apiUrl}/delete-review/${id}`, { headers })
        .subscribe({
          next: () => {
            this.reviews.update((prev) => prev.filter((r) => r.id !== id));
            console.log(`Review ${id} deleted successfully.`);
          },
          error: (err) => {
            console.error('Σφάλμα κατά τη διαγραφή:', err);
            this.toastService.showError(
              'Δεν ήταν δυνατή η διαγραφή της κριτικής. Ελέγξτε τα δικαιώματά σας.',
            );
          },
        });
    }
  }

  getRatingClass(rating: number): string {
    if (rating >= 4) return 'sj-rating-high';
    if (rating >= 2.5) return 'sj-rating-mid';
    return 'sj-rating-low';
  }
}
