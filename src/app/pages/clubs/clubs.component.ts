import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-clubs',
  imports: [CommonModule, RouterModule],
  templateUrl: './clubs.component.html',
  styleUrl: './clubs.component.css',
})
export class ClubsComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7000';

  pageInfo = {
    title: 'Clubs & Bars',
    subtitle:
      'Ανακαλύψτε κορυφαίες γεύσεις, από παραδοσιακές ταβέρνες μέχρι μοντέρνα μπερκεράδικα.',
    icon: 'fa-utensils',
    apiCategory: 'clubs',
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
      return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600';
    const cleanPath = path.replace(/\\/g, '/');
    return `${this.apiUrl}${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;
  }
}
