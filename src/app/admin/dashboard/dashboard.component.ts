import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { BusinessSummary, DashboardStats } from '../../models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

private dashboardService = inject(DashboardService);
latestBusinesses: BusinessSummary[] = []; 
recentUsers: any[] = [];

  stats = [
    { title: 'ΣΥΝΟΛΟ ΧΡΗΣΤΩΝ', value: '0', icon: 'fa-solid fa-users', color: '#4e73df', border: 'border-left-primary' },
    { title: 'ΕΠΙΧΕΙΡΗΣΕΙΣ', value: '0', icon: 'fa-solid fa-hotel', color: '#1cc88a', border: 'border-left-success' },
    { title: 'ΝΕΕΣ ΚΡΙΤΙΚΕΣ', value: '0', icon: 'fa-solid fa-comments', color: '#36b9cc', border: 'border-left-info' },
  ];

  chartData: { month: string; value: number }[] = [];

  ngOnInit() {
    this.fetchDashboardData();
  }

  fetchDashboardData() {
    this.dashboardService.getDashboardStats().subscribe({
      next: (data: any) => {
        console.log('🔥 API RESPONSE:', data);
        this.stats[0].value = data.totalUsers || data.TotalUsers || 0;
        this.stats[1].value = data.totalBusinesses || data.TotalBusinesses || 0;
        this.stats[2].value = data.newReviews || data.NewReviews || 0;
        console.log('📊 Data from API:', data);
        this.stats[0].value = data.TotalUsers || data.totalUsers || 0;
        this.stats[1].value = data.TotalBusinesses || data.totalBusinesses || 0;
        this.stats[2].value = data.NewReviews || data.newReviews || 0;
        this.latestBusinesses = data.latestBusinesses || data.LatestBusinesses || [];
      },
      error: (err) => {
        console.error('❌ Σφάλμα API:', err);
      }
    });
  }

  getCategoryIcon(category: string): string {
    if (!category) return 'fa-solid fa-shop'; 
    switch (category.trim()) { 
      case 'Business':      return 'fa-solid fa-briefcase';
      case 'Attractions':   return 'fa-solid fa-map-location-dot';
      case 'Hotel':         return 'fa-solid fa-bed';
      case 'Restaurant':    return 'fa-solid fa-utensils';
      default:              return 'fa-solid fa-shop';
    }
  }

  getCategoryClass(category: string): string {
    if (!category) return 'badge-secondary';
    switch (category.trim()) {
      case 'Business':      return 'badge-primary';
      case 'Attractions':   return 'badge-success';
      default:              return 'badge-secondary';
    }
  }

  getStars(rating: number) {
    return Array(Math.round(rating || 0)).fill(0);
  }

  getStatusClass(status: string) {
    if (status === 'Ενεργός') return 'status-active';
    if (status === 'Αναμονή') return 'status-pending';
    return 'status-blocked';
  }
}
