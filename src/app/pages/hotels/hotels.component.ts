import { Component, inject, OnInit } from '@angular/core';
import { BusinessService } from '../../services/business.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-hotels',
  imports: [CommonModule, RouterModule],
  templateUrl: './hotels.component.html',
  styleUrl: './hotels.component.css',
})
export class HotelsComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7000';

  pageInfo = {
    title: 'Διαμονή',
    subtitle:
      'Βρείτε τα καλύτερα ξενοδοχεία και καταλύματα για τη διαμονή σας.',
    icon: 'fa-bed',
    apiCategory: 'accommodation',
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
          console.error('Σφάλμα φόρτωσης επιχειρήσεων:', err);
          this.businesses = [];
          this.isLoading = false;
        },
      });
  }

  getImageUrl(path: string | undefined): string {
    if (!path || path.trim() === '') {
      return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80';
    }
    if (path.startsWith('http')) return path;
    const cleanPath = path.replace(/\\/g, '/');
    return `${this.apiUrl}${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;
  }
}
