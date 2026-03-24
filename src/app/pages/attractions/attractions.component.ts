import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-attractions',
  imports: [CommonModule, RouterModule],
  templateUrl: './attractions.component.html',
  styleUrl: './attractions.component.css',
})
export class AttractionsComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7000';

  pageInfo = {
    title: 'Αξιοθέατα',
    subtitle:
      'Εξερευνήστε την ιστορία και τον πολιτισμό μέσα από τα σημαντικότερα μνημεία και μουσεία.',
    icon: 'fa-monument',
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
          this.businesses = [];
          this.isLoading = false;
        },
      });
  }

  getImageUrl(path: string | undefined): string {
    if (!path || path.trim() === '')
      return 'https://images.unsplash.com/photo-1548013146-72479768bbaa?w=600';
    const cleanPath = path.replace(/\\/g, '/');
    return `${this.apiUrl}${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;
  }
}
