import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-restaurants',
  imports: [CommonModule, RouterModule],
  templateUrl: './restaurants.component.html',
  styleUrl: './restaurants.component.css',
})
export class RestaurantsComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7000';

  pageInfo = {
    title: 'Κλαμπς & Bar',
    subtitle:
      'Η νυχτερινή ζωή της πόλης στα καλύτερά της. Ανακαλύψτε τα πιο hot spots.',
    icon: 'fa-martini-glass-citrus',
    apiCategory: 'restaurants',
  };

  businesses: any[] = [];
  isLoading: boolean = true;

  ngOnInit() {
    this.fetchBusinesses();
  }

  fetchBusinesses() {
    this.isLoading = true;
    this.http
      .get<
        any[]
      >(`${this.apiUrl}/Business/category/${this.pageInfo.apiCategory}`)
      .subscribe({
        next: (data) => {
          this.businesses = data;
          this.isLoading = false;
        },
        error: (err) => {
          this.businesses = [];
          this.isLoading = false;
        },
      });
  }

  getImageUrl(path: string | undefined): string {
    if (!path || path.trim() === '')
      return 'https://images.unsplash.com/photo-1514525253344-f814d074e015?w=600';
    const cleanPath = path.replace(/\\/g, '/');
    return `${this.apiUrl}${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;
  }
}
