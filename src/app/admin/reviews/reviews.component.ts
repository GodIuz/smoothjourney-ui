import { Component, inject, OnInit } from '@angular/core';
import { ReviewServiceService } from '../../services/review-service.service';
import { CommonModule, DatePipe } from '@angular/common';
@Component({
  selector: 'app-reviews',
  imports: [CommonModule, DatePipe],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css',
})
export class ReviewsComponent implements OnInit {
  private reviewService = inject(ReviewServiceService);

  reviews: any[] = [];
  isLoading = false;

  ngOnInit() {
    this.loadReviews();
  }

  loadReviews() {
    this.isLoading = true;
    this.reviewService.getAllReviews().subscribe({
      next: (data) => {
        this.reviews = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching reviews:', err);
        this.isLoading = false;
      },
    });
  }

  getStars(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }

  onDelete(id: number) {
    if (confirm('Είστε σίγουρος ότι θέλετε να διαγράψετε αυτή την κριτική;')) {
      this.reviewService.deleteReview(id).subscribe({
        next: () => {
          this.reviews = this.reviews.filter((r) => r.reviewId !== id);
          alert('Η κριτική διαγράφηκε.');
        },
        error: () => alert('Σφάλμα κατά τη διαγραφή.'),
      });
    }
  }
}
