import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BusinessService } from '../../services/business.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-business-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './business-details.component.html',
  styleUrls: ['./business-details.component.css'],
})
export class BusinessDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private businessService = inject(BusinessService);
  private http = inject(HttpClient);
  isScamAlertVisible: boolean = false;
isClosedBySession: boolean = false;
  business: any = null;
  isLoading = true;
  private apiUrl = 'https://localhost:7000';

  newReview = {
    rating: 0,
    comment: '',
  };
  isSubmitting = false;

  ngOnInit() {
    const nameFromUrl = this.route.snapshot.paramMap.get('name');
    if (nameFromUrl) {
      this.loadBusiness(nameFromUrl);
    }
    this.checkScamStatus();
  }

  loadBusiness(nameFromUrl: string) {
    this.businessService.getAllBusinesses().subscribe({
      next: (list) => {
        const decodedName = decodeURIComponent(nameFromUrl);

        this.business = list.find(
          (b) =>
            b.name === decodedName ||
            b.name.toLowerCase() === decodedName.toLowerCase() ||
            b.businessId.toString() === decodedName,
        );

        if (this.business) {
          console.log('📦 Business Data:', this.business);

          if (!this.business.reviews && this.business.Reviews) {
            this.business.reviews = this.business.Reviews;
          }

          if (!this.business.reviews) {
            this.business.reviews = [];
          }
          this.business.reviews.sort((a: any, b: any) => {
            return (
              new Date(b.createdDate || b.date).getTime() -
              new Date(a.createdDate || a.date).getTime()
            );
          });
        }

        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  getImageUrl(path: string): string {
    if (!path) return 'assets/images/placeholder.jpg';
    if (path.startsWith('http')) return path;
    return `${this.apiUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  }

  setRating(stars: number) {
    this.newReview.rating = stars;
  }

  submitReview() {
    if (this.newReview.rating === 0 || !this.newReview.comment.trim()) {
      alert('Παρακαλώ επιλέξτε αστεράκια και γράψτε ένα σχόλιο.');
      return;
    }

    this.isSubmitting = true;

    const payload = {
      businessId: this.business.businessId,
      rating: this.newReview.rating,
      content: this.newReview.comment,
    };

    this.http.post(`${this.apiUrl}/Reviews/add`, payload).subscribe({
      next: (res: any) => {
        alert('Η κριτική σας καταχωρήθηκε!');

        const currentUser = localStorage.getItem('userName') || 'Εγώ';

        if (!this.business.reviews) {
          this.business.reviews = [];
        }
        this.business.reviews.unshift({
          user: { firstName: currentUser, lastName: '' },
          rating: this.newReview.rating,
          content: this.newReview.comment,
          createdDate: new Date(),
        });

        this.newReview = { rating: 0, comment: '' };
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error(err);
        alert('Σφάλμα κατά την αποστολή.');
        this.isSubmitting = false;
      },
    });
  }

  getStars(rating: number) {
    return new Array(Math.round(rating || 0)).fill(0);
  }

  checkScamStatus() {
  if (!this.business || !this.business.reviews) return;

  const closedScams = JSON.parse(localStorage.getItem('closedScams') || '[]');
  if (closedScams.includes(this.business.businessId)) {
    this.isClosedBySession = true;
    return;
  }

  const reviews = this.business.reviews;
  if (reviews.length > 0) {
    const oneStarReviews = reviews.filter((r: any) => r.rating === 1).length;
    if ((oneStarReviews / reviews.length) > 0.5) {
      this.isScamAlertVisible = true;
    }
  }
}

closeAlert() {
  this.isScamAlertVisible = false;
}
}
