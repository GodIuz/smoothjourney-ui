import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Business, BusinessService } from '../../services/business.service';

@Component({
  selector: 'app-homeapp',
  imports: [RouterModule,CommonModule],
  templateUrl: './homeapp.component.html',
  styleUrl: './homeapp.component.css'
})
export class HomeappComponent implements OnInit {
private businessService = inject(BusinessService);
  hotels: Business[] = [];
  restaurants: Business[] = [];
  
  categories = [
    { name: 'Ξενοδοχεία', icon: 'fa-solid fa-bed' },
    { name: 'Εστιατόρια', icon: 'fa-solid fa-utensils' },
    { name: 'Nightlife',  icon: 'fa-solid fa-champagne-glasses' },
    { name: 'Αξιοθέατα',  icon: 'fa-solid fa-camera' }
  ];

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.businessService.getAllBusinesses().subscribe({
      next: (data: Business[]) => { 
        console.log('Ήρθαν τα δεδομένα:', data);
        this.hotels = data.filter(b => b.category === 'Hotel' || b.category === 'Ξενοδοχείο');
        this.restaurants = data.filter(b => b.category === 'Restaurant' || b.category === 'Εστιατόριο');
      },
      error: (err) => {
        console.error('Σφάλμα κατά τη λήψη δεδομένων:', err);
      }
    });
  }

  getStars(rating: number) {
    const starCount = Math.round(rating || 0);
    return new Array(starCount).fill(0);
  }

}
