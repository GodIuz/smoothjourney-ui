import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BusinessService } from '../../services/business.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AiSummaryComponent } from '../ai-summary/ai-summary.component';

@Component({
  selector: 'app-business-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AiSummaryComponent],
  templateUrl: './business-details.component.html',
  styleUrls: ['./business-details.component.css'],
})
export class BusinessDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private businessService = inject(BusinessService);
  private http = inject(HttpClient);

  business: any = null;
  isLoading = true;
  isSubmitting = false;
  isScamAlertVisible: boolean = false;
  private apiUrl = 'https://localhost:7000';

  newReview = {
    rating: 5,
    comment: '',
  };

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    const nameFromUrl = this.route.snapshot.paramMap.get('name');

    if (id) {
      this.loadBusinessById(id);
    } else if (nameFromUrl) {
      this.loadBusinessByName(nameFromUrl);
    } else {
      this.isLoading = false;
    }
  }

  loadBusinessById(id: number) {
    this.businessService.getById(id).subscribe({
      next: (data) => this.processBusinessData(data),
      error: (err) => {
        console.error('Error loading business:', err);
        this.isLoading = false;
      },
    });
  }

  loadBusinessByName(nameFromUrl: string) {
    this.businessService.getAllBusinesses().subscribe({
      next: (list) => {
        const decodedName = decodeURIComponent(nameFromUrl);
        const found = list.find(
          (b) =>
            b.name === decodedName ||
            b.name.toLowerCase() === decodedName.toLowerCase() ||
            b.businessId?.toString() === decodedName,
        );
        if (found) {
          this.processBusinessData(found);
        } else {
          this.isLoading = false;
        }
      },
      error: () => (this.isLoading = false),
    });
  }

  processBusinessData(data: any) {
    this.business = data;
    this.business.reviews = data.reviews || data.Reviews || [];

    this.business.reviews.sort((a: any, b: any) => {
      return (
        new Date(b.createdAt || b.createdDate || b.date).getTime() -
        new Date(a.createdAt || a.createdDate || a.date).getTime()
      );
    });

    this.checkScamStatus();
    this.isLoading = false;
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
    if (!this.newReview.comment.trim() || this.newReview.comment.length > 500) {
      alert('Το σχόλιο πρέπει να είναι έως 500 χαρακτήρες.');
      return;
    }

    this.isSubmitting = true;
    const payload = {
      businessId: this.business.id || this.business.businessId,
      rating: this.newReview.rating,
      content: this.newReview.comment,
    };

    this.http.post(`${this.apiUrl}/Reviews/add`, payload).subscribe({
      next: (res: any) => {
        alert('Η κριτική σας καταχωρήθηκε!');
        this.business.reviews.unshift({
          user: {
            firstName: localStorage.getItem('userName') || 'Εγώ',
            lastName: '',
          },
          rating: this.newReview.rating,
          content: this.newReview.comment,
          createdDate: new Date(),
        });
        this.newReview = { rating: 5, comment: '' };
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
    return new Array(Math.floor(rating || 0)).fill(0);
  }

  checkScamStatus() {
    if (!this.business.reviews || this.business.reviews.length === 0) return;
    const oneStarReviews = this.business.reviews.filter(
      (r: any) => r.rating === 1,
    ).length;
    if (oneStarReviews / this.business.reviews.length > 0.5) {
      this.isScamAlertVisible = true;
    }
  }

  closeAlert() {
    this.isScamAlertVisible = false;
  }
}
