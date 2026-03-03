import { Component, inject } from '@angular/core';
import { BusinessService } from '../../services/business.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-favourites',
  imports: [CommonModule, RouterModule],
  templateUrl: './favourites.component.html',
  styleUrl: './favourites.component.css',
})
export class FavouritesComponent {
  private businessService = inject(BusinessService);
  private apiUrl = 'https://localhost:7000';
  favBusinesses: any[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.isLoading = true;

    this.businessService.getMyFavorites().subscribe({
      next: (data: any[]) => {
        console.log('Favorites loaded:', data);
        this.favBusinesses = data.map((b: any) => ({
          ...b,
          reviews: b.reviews || [],
        }));

        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading favorites:', err);
        this.isLoading = false;
      },
    });
  }

  removeFavorite(event: Event, businessId: number) {
    event.stopPropagation();

    if (!confirm('Θέλεις σίγουρα να το αφαιρέσεις από τα αγαπημένα;')) return;

    this.businessService.toggleFavorite(businessId).subscribe({
      next: () => {
        this.favBusinesses = this.favBusinesses.filter(
          (b) => b.businessId !== businessId,
        );
      },
      error: (err: any) => console.error('Error removing favorite:', err),
    });
  }

  getImageUrl(path: string | undefined): string {
    if (!path) return 'assets/default.jpg';
    if (path.startsWith('http')) return path;
    const cleanPath = path.replace(/\\/g, '/');
    return `${this.apiUrl}${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;
  }

  getBusinessRating(business: any): number {
    if (!business.reviews || business.reviews.length === 0) return 0;
    const total = business.reviews.reduce(
      (sum: number, r: any) => sum + r.rating,
      0,
    );
    return total / business.reviews.length;
  }

  getStars(rating: number): number[] {
    const rounded = Math.round(rating || 0);
    return new Array(rounded).fill(0);
  }

  getPriceSymbol(level: number): string {
    return level ? '€'.repeat(level) : '';
  }
}
