import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BusinessService } from '../../services/business.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin-businesses',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './businesses.component.html',
  styleUrl: './businesses.component.css',
})
export class BusinessesComponent implements OnInit {
  private businessService = inject(BusinessService);
  private toastService = inject(ToastService);

  businesses = signal<any[]>([]);
  isLoading = signal(false);
  private apiUrl = 'https://localhost:7000';

  ngOnInit() {
    this.loadBusinesses();
  }

  loadBusinesses() {
    this.isLoading.set(true);
    this.businessService.getAllBusinesses().subscribe({
      next: (data) => {
        const mappedData = data.map((biz: any) => {
          const rawUrl =
            biz.imageUrl || biz.ImageUrl || biz.coverImageUrl || null;

          return {
            ...biz,
            id: biz.businessId || biz.id,
            coverImage: this.getImageUrl(rawUrl),
            isHiddenGem: biz.isHiddenGem ?? false,
          };
        });

        this.businesses.set(mappedData);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('API Error:', err);
        this.toastService.showError('❌ API Error');
        this.isLoading.set(false);
      },
    });
  }

  getImageUrl(url: string | null): string {
    if (!url || url.trim() === '') return '/assets/images/placeholder.jpg';
    if (url.startsWith('http')) return url;

    let path = url.replace(/\\/g, '/');
    if (path.startsWith('/')) path = path.substring(1);

    return `${this.apiUrl}/${path}`;
  }

  handleImageError(event: any) {
    const imgElement = event.target as HTMLImageElement;
    if (!imgElement.src.includes('placeholder.jpg')) {
      imgElement.src = '/assets/images/placeholder.jpg';
    }
  }

  deleteBusiness(id: number) {
    if (
      confirm('Είστε σίγουρος ότι θέλετε να διαγράψετε αυτή την καταχώρηση;')
    ) {
      this.businessService.deleteBusiness(id).subscribe({
        next: () => {
          this.businesses.update((prev) => prev.filter((b) => b.id !== id));
        },
        error: (err) => this.toastService.showError('Σφάλμα κατά τη διαγραφή.'),
      });
    }
  }
}
