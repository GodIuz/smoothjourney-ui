import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-trip-maker',
  imports: [CommonModule, FormsModule],
  templateUrl: './trip-maker.component.html',
  styleUrl: './trip-maker.component.css',
})
export class TripMakerComponent implements OnInit {
  tripId: number | null = null;
  tripName: string = '';
  selectedCity: string = '';
  totalBudget: number = 0;
  startDate: string = '';
  endDate: string = '';
  cities: string[] = [
    'Αθήνα',
    'Ηράκλειο',
    'Θεσσαλονίκη',
    'Πειραιάς',
    'Ρόδος',
    'Χανιά',
  ];
  filteredBusinesses: any[] = [];
  selectedItems: any[] = [];
  currentCost: number = 0;

  priceEstimation: { [key: number]: number } = { 1: 10, 2: 20, 3: 40, 4: 80 };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  onCityChange() {
    if (!this.selectedCity) return;
    this.http
      .get<any[]>(`https://localhost:7000/Business/city/${this.selectedCity}`)
      .subscribe((data) => {
        this.filteredBusinesses = data;
      });
  }

  startNewTrip() {
    if (
      !this.tripName ||
      !this.selectedCity ||
      !this.startDate ||
      !this.endDate
    ) {
      Swal.fire('Προσοχή', 'Συμπληρώστε όλα τα πεδία!', 'warning');
      return;
    }

    const dto = {
      title: this.tripName,
      startDate: this.startDate,
      endDate: this.endDate,
      totalBudget: this.totalBudget,
      city: this.selectedCity,
    };

    this.http
      .post<any>('https://localhost:7000/Trips/create-manual', dto)
      .subscribe({
        next: (res) => {
          this.tripId = res.tripId;
          Swal.fire(
            'Επιτυχία',
            'Το ταξίδι δημιουργήθηκε. Προσθέστε δραστηριότητες!',
            'success',
          );
        },
      });
  }

  addItem(business: any) {
    if (!this.tripId) {
      Swal.fire('Προσοχή', 'Ξεκινήστε πρώτα το ταξίδι!', 'info');
      return;
    }

    const cost = this.priceEstimation[business.priceRange?.length] || 15;
    const itemDto = {
      title: business.name,
      description: business.categoryType,
      scheduledTime: this.startDate,
      cost: cost,
      businessId: business.businessId,
    };

    this.http
      .post<any>(
        `https://localhost:7000/Trips/${this.tripId}/add-item`,
        itemDto,
      )
      .subscribe({
        next: (res) => {
          this.selectedItems.push(business);
          this.currentCost = res.newCurrentCost;
        },
      });
  }

  getImageUrl(url: string) {
    return url || 'assets/default-trip.jpg';
  }
}
