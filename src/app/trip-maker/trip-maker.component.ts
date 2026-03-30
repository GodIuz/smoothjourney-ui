import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
} from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trip-maker',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './trip-maker.component.html',
  styleUrl: './trip-maker.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TripMakerComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router); 
  private apiUrl = 'https://localhost:7000';

  currentStep = signal(1);
  isTransitioning = signal(false);
  isSaving = signal(false);
  isLoadingBusinesses = signal(false);

  notification = signal<{
    message: string;
    type: 'success' | 'error' | 'warning';
  } | null>(null);

  tripData = {
    tripId: 0,
    title: '',
    city: '',
    startDate: '',
    endDate: '',
    totalBudget: 0,
    mood: 'Relax',
    description: '',
  };

  availableCities: string[] = [];
  allBusinesses: any[] = [];
  availableBusinesses: any[] = [];
  selectedItems = signal<any[]>([]);

  currentCost = computed(() => {
    return this.selectedItems().reduce(
      (acc, item) => acc + (item.estimatedCost || 0),
      0,
    );
  });

  budgetPercent = computed(() => {
    if (this.tripData.totalBudget <= 0) return 0;
    return Math.round((this.currentCost() / this.tripData.totalBudget) * 100);
  });

  remainingBudget = computed(() => {
    return this.tripData.totalBudget - this.currentCost();
  });

  completedCount = computed(() => {
    return this.selectedItems().filter((i) => i.visited).length;
  });

  ngOnInit() {
    this.http.get<any[]>(`${this.apiUrl}/Business/all`).subscribe({
      next: (data) => {
        this.allBusinesses = data;
        const cities = data
          .map((b) => b.city)
          .filter((c) => c && c.trim() !== '');
        this.availableCities = [...new Set(cities)].sort();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Σφάλμα φόρτωσης επιχειρήσεων:', err);
        this.allBusinesses = [];
      },
    });
  }

  showNotif(message: string, type: 'success' | 'error' | 'warning' = 'success') {
    this.notification.set({ message, type });
    if (type === 'success') {
      setTimeout(() => this.closeNotification(), 3000);
    }
  }

  closeNotification() {
    this.notification.set(null);
  }

  goToStep(step: number) {
    this.isTransitioning.set(true);
    setTimeout(() => {
      this.currentStep.set(step);
      this.isTransitioning.set(false);
    }, 500);
  }

  isSetupValid() {
    return (
      this.tripData.title &&
      this.tripData.city &&
      this.tripData.totalBudget > 0 &&
      this.tripData.startDate &&
      this.tripData.endDate
    );
  }

  proceedToStep3() {
    if (!this.tripData.city) {
      this.showNotif('Παρακαλώ επιλέξτε πόλη!', 'warning');
      return;
    }

    this.isLoadingBusinesses.set(true);
    this.goToStep(3);

    this.availableBusinesses = this.allBusinesses.filter(
      (b) => b.city && b.city.toLowerCase() === this.tripData.city.toLowerCase(),
    );

    this.isLoadingBusinesses.set(false);

    if (this.availableBusinesses.length === 0) {
      this.showNotif(`Δεν βρέθηκαν επιχειρήσεις για: ${this.tripData.city}.`, 'warning');
    }
  }

  calculateEstimatedCost(business: any): number {
    const moodTags = (business.moodTags || '').toLowerCase();
    const category = (business.category || '').toLowerCase();
    const categoryType = (business.categoryType || '').toLowerCase();
    const city = (business.city || this.tripData.city).toLowerCase();

    const isLuxury = moodTags.includes('luxury');
    const isHotelOrRestaurant =
      category.includes('hotel') ||
      category.includes('ξενοδοχείο') ||
      categoryType.includes('hotel') ||
      categoryType.includes('ξενοδοχείο') ||
      category.includes('restaurant') ||
      category.includes('εστιατόριο') ||
      categoryType.includes('restaurant') ||
      categoryType.includes('εστιατόριο');

    if (isLuxury && isHotelOrRestaurant) {
      if (city.includes('αθήνα')) return 500;
      if (city.includes('θεσσαλονίκη')) return 450;
      if (city.includes('ηράκλειο') || city.includes('χανιά')) return 400;
      if (city.includes('ρόδος')) return 350;
      return 300;
    }

    return business.priceRange ? business.priceRange.length * 15 : 20;
  }

  addItemLocally(business: any) {
    const cost = this.calculateEstimatedCost(business);

    this.selectedItems.update((prev) => [
      ...prev,
      { ...business, estimatedCost: cost, visited: false },
    ]);

    if (this.budgetPercent() > 100) {
      this.showNotif('Προσοχή: Μόλις ξεπεράσατε τον προϋπολογισμό σας!', 'warning');
    }
  }

  removeItemLocally(index: number) {
    this.selectedItems.update((prev) => {
      const updatedList = [...prev];
      updatedList.splice(index, 1);
      return updatedList;
    });
  }

  async saveEntireTripAndProceed() {
    if (this.selectedItems().length === 0) {
      this.showNotif('Προσθέστε τουλάχιστον μία δραστηριότητα!', 'warning');
      return;
    }

    this.isSaving.set(true);

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('jwt');
      let headers = new HttpHeaders();
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }

      const tripDto = {
        title: this.tripData.title,
        city: this.tripData.city,
        startDate: this.tripData.startDate,
        endDate: this.tripData.endDate,
        totalBudget: this.tripData.totalBudget,
        mood: this.tripData.mood,
        description: this.tripData.description,
      };

      const tripRes = await firstValueFrom(
        this.http.post<any>(`${this.apiUrl}/Trips/create-manual`, tripDto, { headers })
      );

      const savedTripId = tripRes.tripId;
      this.tripData.tripId = savedTripId;
      const newItems = [...this.selectedItems()];

      for (let i = 0; i < newItems.length; i++) {
        const itemDto = {
          tripId: savedTripId,
          businessId: newItems[i].businessId,
          title: newItems[i].name,
          description: newItems[i].categoryType || 'Δραστηριότητα',
          scheduledTime: this.tripData.startDate,
          cost: newItems[i].estimatedCost,
        };

        const itemRes = await firstValueFrom(
          this.http.post<any>(`${this.apiUrl}/Trips/add-item`, itemDto, { headers })
        );
        newItems[i].tripItemId = itemRes.tripItemId; 
      }

      this.selectedItems.set(newItems);
      this.showNotif('Το ταξίδι αποθηκεύτηκε επιτυχώς!', 'success');
      this.goToStep(4);
    } catch (error: any) {
      console.error('Σφάλμα:', error);
      this.showNotif('Πρόβλημα κατά την αποθήκευση: ' + (error.error || error.statusText), 'error');
    } finally {
      this.isSaving.set(false);
    }
  }

  toggleVisited(index: number) {
    const current = this.selectedItems();
    current[index].visited = !current[index].visited;
    this.selectedItems.set([...current]);
  }

  async saveTrackerProgress() {
    this.isSaving.set(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('jwt');
      let headers = new HttpHeaders();
      if (token) headers = headers.set('Authorization', `Bearer ${token}`);

      const updatePayload = this.selectedItems().map(item => ({
        tripItemId: item.tripItemId || 0,
        isVisited: item.visited
      }));

      await firstValueFrom(
        this.http.post(`${this.apiUrl}/Trips/update-tracker`, updatePayload, { headers })
      );

      this.showNotif('Η πρόοδος αποθηκεύτηκε!', 'success');
      setTimeout(() => {
        this.router.navigate(['/mainapp/my-trips']);
      }, 1500);

    } catch (error) {
      console.error('Σφάλμα Tracker:', error);
      this.showNotif('Σφάλμα κατά την αποθήκευση προόδου.', 'error');
    } finally {
      this.isSaving.set(false);
    }
  }
}
