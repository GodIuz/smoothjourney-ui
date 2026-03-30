import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BusinessService } from '../../services/business.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AiSummaryComponent } from '../ai-summary/ai-summary.component';
import { ToastService } from '../../services/toast.service';

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

  newReview = { rating: 5, comment: '' };

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
      error: () => this.isLoading = false
    });
  }

  loadBusinessByName(nameFromUrl: string) {
    this.businessService.getAllBusinesses().subscribe({
      next: (list) => {
        const decodedName = decodeURIComponent(nameFromUrl);
        const found = list.find(b => 
          b.name?.toLowerCase() === decodedName.toLowerCase() || 
          b.businessId?.toString() === decodedName
        );
        if (found) this.processBusinessData(found);
        else this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  processBusinessData(data: any) {
    this.business = data;
    this.business.reviews = data.reviews || data.Reviews || [];
    this.business.reviews.sort((a: any, b: any) => 
      new Date(b.createdAt || b.createdDate).getTime() - new Date(a.createdAt || a.createdDate).getTime()
    );
    this.checkScamStatus();
    this.isLoading = false;
  }

  getImageUrl(path: string): string {
    if (!path) return 'assets/default.jpg';
    if (path.startsWith('http')) return path;
    return `${this.apiUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  }

  setRating(stars: number) { this.newReview.rating = stars; }

  submitReview() {
    if (!this.newReview.comment.trim()) return;
    this.isSubmitting = true;
    const payload = {
      businessId: this.business.id || this.business.businessId,
      rating: this.newReview.rating,
      content: this.newReview.comment
    };

    this.http.post(`${this.apiUrl}/Reviews/add`, payload).subscribe({
      next: () => {
        this.business.reviews.unshift({
          user: { firstName: localStorage.getItem('userName') || 'Εγώ', lastName: '' },
          rating: this.newReview.rating,
          content: this.newReview.comment,
          createdDate: new Date()
        });
        this.newReview = { rating: 5, comment: '' };
        this.isSubmitting = false;
      },
      error: () => this.isSubmitting = false
    });
  }

  getStars(rating: number) { return new Array(Math.floor(rating || 0)).fill(0); }

  checkScamStatus() {
    if (!this.business.reviews?.length) return;
    const oneStar = this.business.reviews.filter((r: any) => r.rating === 1).length;
    if (oneStar / this.business.reviews.length > 0.5) this.isScamAlertVisible = true;
  }

  closeAlert() { this.isScamAlertVisible = false; }
}