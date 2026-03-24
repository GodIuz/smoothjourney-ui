import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css',
})
export class ReviewsComponent implements OnInit {
  private http = inject(HttpClient);

  reviews: any[] = [];
  isLoading = true;
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
    this.isLoading = true;
    const headers = this.getAuthHeaders();

    this.http.get<any[]>(`${this.apiUrl}/all-reviews`, { headers }).subscribe({
      next: (data) => {
        console.log('Reviews loaded:', data);
        this.reviews = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Σφάλμα κατά τη φόρτωση των κριτικών:', err);
        this.isLoading = false;
      },
    });
  }

  deleteReview(id: number) {
    if (
      confirm(
        'Προσοχή! Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την κακόβουλη κριτική;',
      )
    ) {
      const headers = this.getAuthHeaders();

      this.http
        .delete(`${this.apiUrl}/delete-review/${id}`, { headers })
        .subscribe({
          next: () => {
            this.reviews = this.reviews.filter((r) => r.id !== id);
            console.log(`Review ${id} deleted successfully.`);
          },
          error: (err) => {
            console.error('Σφάλμα κατά τη διαγραφή:', err);
            alert(
              'Δεν ήταν δυνατή η διαγραφή της κριτικής. Ελέγξτε τα δικαιώματά σας.',
            );
          },
        });
    }
  }

  getStars(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }

  getRatingClass(rating: number): string {
    if (rating >= 4) return 'rating-high';
    if (rating >= 2.5) return 'rating-mid';
    return 'rating-low';
  }
}
