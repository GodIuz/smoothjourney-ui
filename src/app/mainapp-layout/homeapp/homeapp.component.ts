import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BusinessService } from '../../services/business.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-homeapp',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './homeapp.component.html',
  styleUrls: ['./homeapp.component.css'],
})
export class HomeappComponent implements OnInit {
  private businessService = inject(BusinessService);
  private apiUrl = 'https://localhost:7000';
  searchTerm: string = '';
  rawData: any[] = [];
  filteredBusinesses: any[] = [];
  favoriteIds: number[] = [];
  cities: string[] = [];
  countries: string[] = [];
  categoryTypes: string[] = [];
  moodTags: string[] = [];
  showHiddenGems: boolean = false;
  closedScams: number[] = [];
  selectedFilters = {
    category: '',
    cities: {} as any,
    countries: {} as any,
    categoryTypes: {} as any,
    moods: {} as any,
    priceLevel: null as number | null,
    minRating: 0,
  };

  currentSort = 'rating_desc';

  ngOnInit() {
    this.fetchData();
    this.loadFavorites();
    const savedScams = localStorage.getItem('closedScams');
    if (savedScams) {
      this.closedScams = JSON.parse(savedScams);
    }
  }

  fetchData() {
    this.businessService.getAllBusinesses().subscribe({
      next: (data: any[]) => {
        this.rawData = data.map((b) => ({
          ...b,
          businessId: b.businessId || b.BusinessId || b.id,
          name: b.name || b.Name,
          city: b.city || b.City,
          country: b.country || b.Country,
          category: b.category || b.Category,
          categoryType: b.categoryType || b.CategoryType,
          priceLevel: b.priceLevel || b.PriceLevel,
          imageUrl: b.imageUrl || b.ImageUrl,
          moodTags: b.moodTags || b.MoodTags,
          createAt: b.createAt || b.CreateAt,
          reviews: b.reviews || b.Reviews || [],
          calculatedRating: this.calculateRating(b),
        }));

        this.extractFilterOptions();
        this.applyFilters();
      },
      error: (err) => console.error(err),
    });
  }

  extractFilterOptions() {
    this.cities = [
      ...new Set(this.rawData.map((b) => b.city).filter(Boolean)),
    ].sort();
    this.countries = [
      ...new Set(this.rawData.map((b) => b.country).filter(Boolean)),
    ].sort();

    this.categoryTypes = [
      ...new Set(this.rawData.map((b) => b.categoryType).filter(Boolean)),
    ].sort();

    const tagsSet = new Set<string>();
    this.rawData.forEach((b) => {
      if (b.moodTags)
        b.moodTags.split(',').forEach((t: string) => tagsSet.add(t.trim()));
    });
    this.moodTags = Array.from(tagsSet).sort();
  }

  isScam(item: any): boolean {
    if (this.closedScams.includes(item.businessId)) return false;

    const reviews = item.reviews || [];
    if (reviews.length === 0) return false;

    const oneStarReviews = reviews.filter((r: any) => r.rating === 1).length;
    return oneStarReviews / reviews.length > 0.5;
  }

  closeScamAlert(businessId: number) {
    this.closedScams.push(businessId);
    localStorage.setItem('closedScams', JSON.stringify(this.closedScams));
  }

  toggleHiddenGems() {
    this.showHiddenGems = !this.showHiddenGems;
    this.applyFilters();
  }

  applyFilters() {
    let result = [...this.rawData];

    if (this.showHiddenGems) {
      result = result.filter((b) => b.isHiddenGem === true);
    }

    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const search = this.searchTerm.toLowerCase().trim();
      result = result.filter(
        (b) => b.name && b.name.toLowerCase().includes(search),
      );
    }

    if (this.selectedFilters.category) {
      result = result.filter(
        (b) => b.category === this.selectedFilters.category,
      );
    }

    const activeCities = Object.keys(this.selectedFilters.cities).filter(
      (k) => this.selectedFilters.cities[k],
    );
    if (activeCities.length > 0)
      result = result.filter((b) => activeCities.includes(b.city));

    const activeCountries = Object.keys(this.selectedFilters.countries).filter(
      (k) => this.selectedFilters.countries[k],
    );
    if (activeCountries.length > 0)
      result = result.filter((b) => activeCountries.includes(b.country));

    const activeTypes = Object.keys(this.selectedFilters.categoryTypes).filter(
      (k) => this.selectedFilters.categoryTypes[k],
    );
    if (activeTypes.length > 0)
      result = result.filter((b) => activeTypes.includes(b.categoryType));

    const activeMoods = Object.keys(this.selectedFilters.moods).filter(
      (k) => this.selectedFilters.moods[k],
    );
    if (activeMoods.length > 0) {
      result = result.filter(
        (b) =>
          b.moodTags &&
          activeMoods.some((tag: string) => b.moodTags.includes(tag)),
      );
    }

    if (this.selectedFilters.priceLevel)
      result = result.filter(
        (b) => b.priceLevel === this.selectedFilters.priceLevel,
      );

    if (this.selectedFilters.minRating > 0)
      result = result.filter(
        (b) => b.calculatedRating >= this.selectedFilters.minRating,
      );

    this.sortData(result);
    this.filteredBusinesses = result;
  }

  selectCategory(catDbName: string) {
    this.selectedFilters.category =
      this.selectedFilters.category === catDbName ? '' : catDbName;
    this.applyFilters();
  }

  sortData(data: any[]) {
    return data.sort((a, b) => {
      switch (this.currentSort) {
        case 'rating_desc':
          return b.calculatedRating - a.calculatedRating;
        case 'price_asc':
          return (a.priceLevel || 99) - (b.priceLevel || 99);
        case 'price_desc':
          return (b.priceLevel || 0) - (a.priceLevel || 0);
        case 'newest':
          return (
            new Date(b.createAt || 0).getTime() -
            new Date(a.createAt || 0).getTime()
          );
        default:
          return 0;
      }
    });
  }

  getImageUrl(path: string | undefined): string {
    if (!path) return 'assets/default.jpg';
    if (path.startsWith('http')) return path;
    const cleanPath = path.replace(/\\/g, '/');
    return `${this.apiUrl}${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;
  }

  calculateRating(business: any): number {
    const reviews = business.reviews || [];
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum: number, r: any) => sum + r.rating, 0);
    return total / reviews.length;
  }

  getStars(rating: number): number[] {
    return new Array(Math.round(rating || 0)).fill(0);
  }

  getPriceSymbol(level: number): string {
    return level ? '€'.repeat(level) : '';
  }

  loadFavorites() {
    const token = localStorage.getItem('token');
    if (!token) return;
    this.businessService.getFavoriteIds().subscribe({
      next: (ids) => (this.favoriteIds = ids),
      error: (err) => console.error(err),
    });
  }

  toggleFavorite(event: Event, businessId: number) {
    event.stopPropagation();
    if (!localStorage.getItem('token')) {
      alert('Login required');
      return;
    }

    if (this.isFavorite(businessId)) {
      this.favoriteIds = this.favoriteIds.filter((id) => id !== businessId);
    } else {
      this.favoriteIds.push(businessId);
    }
    this.businessService.toggleFavorite(businessId).subscribe({
      error: () => this.loadFavorites(),
    });
  }

  isFavorite(businessId: number): boolean {
    return this.favoriteIds.includes(businessId);
  }
}
