import { Component, OnInit } from '@angular/core';
import { BusinessService } from '../../services/business.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hotels',
  imports: [CommonModule, RouterModule],
  templateUrl: './hotels.component.html',
  styleUrl: './hotels.component.css'
})
export class HotelsComponent implements OnInit {
accommodations: any[] = [];
  isLoading = true;

  possibleBadges = ['Best for Couples', 'Solo Traveler Pick', 'Luxury & Spa', 'Budget Friendly', 'Top Location', 'Sunset View'];
  
  possibleSummaries = [
    'Εξαιρετική τοποθεσία κοντά στο κέντρο. Οι επισκέπτες λατρεύουν το πρωινό και την καθαριότητα.',
    'Ιδανικό για χαλάρωση. Ησυχία, άνετα κρεβάτια και πολύ φιλικό προσωπικό.',
    'Μοντέρνα αισθητική και γρήγορο WiFi. Τέλεια επιλογή για digital nomads.',
    'Μαγευτική θέα και ρομαντική ατμόσφαιρα. Λίγο ακριβό, αλλά αξίζει κάθε ευρώ.'
  ];

  constructor(private businessService: BusinessService, private router: Router) {}

  ngOnInit() {
    this.businessService.getFeaturedAccommodations().subscribe({
      next: (data) => {
        this.accommodations = data.map(biz => ({
          ...biz,
          type: biz.category,
          aiBadge: this.getRandomItem(this.possibleBadges),
          aiSummary: this.getRandomItem(this.possibleSummaries),
          matchScore: Math.floor(Math.random() * (99 - 85 + 1)) + 85
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching accommodations:', err);
        this.isLoading = false;
      }
    });
  }

  getRandomItem(arr: string[]) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  addToPlan(item: any) {
  const confirmAction = confirm(`Μετάβαση στην εφαρμογή για προσθήκη του "${item.name}";`);
  
    if (confirmAction) {
      const mainAppUrl = 'http://localhost:56486/'; 
      window.location.href = `${mainAppUrl}/login?pendingItem=${item.id}`;
    }
  }
}