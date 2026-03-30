import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ai-trip-planner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-trip-planner.component.html',
  styleUrl: './ai-trip-planner.component.css',
})
export class AiTripPlannerComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'https://localhost:7000';

  currentStep = signal(1);
  isTransitioning = signal(false);
  isGeneratingAi = signal(false);
  isSaving = signal(false);

  notification = signal<{
    message: string;
    type: 'success' | 'error' | 'warning';
  } | null>(null);

  tripData = {
    title: '',
    city: '',
    startDate: '',
    endDate: '',
    totalBudget: 0,
    mood: 'Relax',
    description: '',
  };

  availableCities: string[] = [];
  generatedPlan: any = null;

  ngOnInit() {
    this.http.get<any[]>(`${this.apiUrl}/Business/all`).subscribe({
      next: (data) => {
        const cities = data
          .map((b) => b.city)
          .filter((c) => c && c.trim() !== '');
        this.availableCities = [...new Set(cities)].sort();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Σφάλμα φόρτωσης επιχειρήσεων:', err);
      },
    });
  }

  showNotif(
    message: string,
    type: 'success' | 'error' | 'warning' = 'success',
  ) {
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

  async generateAiTrip() {
    if (!this.isSetupValid()) {
      this.showNotif('Συμπληρώστε όλα τα βασικά πεδία.', 'warning');
      return;
    }

    this.isGeneratingAi.set(true);
    this.goToStep(3);

    try {
      const start = new Date(this.tripData.startDate);
      const end = new Date(this.tripData.endDate);
      const days =
        Math.ceil(
          Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
        ) + 1;

      const requestPayload = {
        city: this.tripData.city,
        mood: this.tripData.mood,
        days: days,
        startDate: this.tripData.startDate,
        endDate: this.tripData.endDate,
        totalBudget: this.tripData.totalBudget,
        numberOfPeople: 2 
      };

      const res = await firstValueFrom(
        this.http.post<any>(
          `${this.apiUrl}/Trips/generate-mood`,
          requestPayload,
        ),
      );

      this.generatedPlan = res.plan;
      this.isGeneratingAi.set(false);
      this.goToStep(4);
      this.showNotif('Το AI ολοκλήρωσε τον σχεδιασμό!', 'success');
    } catch (error: any) {
      console.error('AI Error:', error);
      this.isGeneratingAi.set(false);
      const errorMsg = error.error?.details || error.error || 'Αποτυχία παραγωγής πλάνου από το AI.';
      this.showNotif(typeof errorMsg === 'string' ? errorMsg : 'Αποτυχία παραγωγής πλάνου.', 'error');
      
      this.goToStep(2);
    }
  }

  async saveAiTrip() {
    if (!this.generatedPlan) return;

    this.isSaving.set(true);

    try {
      const tripDto = {
        title: this.tripData.title,
        city: this.tripData.city,
        startDate: this.tripData.startDate,
        endDate: this.tripData.endDate,
        totalBudget: this.tripData.totalBudget,
        mood: this.tripData.mood,
        description: this.tripData.description,
        days: this.generatedPlan.days,
      };

      await firstValueFrom(
        this.http.post<any>(`${this.apiUrl}/Trips/save-ai-trip`, tripDto),
      );
      this.showNotif('Το ταξίδι αποθηκεύτηκε επιτυχώς!', 'success');
      setTimeout(() => {
        this.router.navigate(['/mainapp/my-trips']);
      }, 1500);
    } catch (error: any) {
      console.error('Σφάλμα αποθήκευσης:', error);
      this.showNotif('Πρόβλημα κατά την αποθήκευση.', 'error');
    } finally {
      this.isSaving.set(false);
    }
  }
}
