import { Component, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-ai-trip-planner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-trip-planner.component.html',
  styleUrl: './ai-trip-planner.component.css',
})
export class AiTripPlannerComponent {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7000/Trips';
  isPlanning = signal(false);
  isSaving = signal(false);
  showSuccess = signal(false);
  aiPlan = signal<any>(null);
  city = '';
  selectedMood = 'Relax';
  maxBudget = 500;
  numberOfPeople = 1;
  startDate = '';
  endDate = '';

  totalAiCost = computed(() => {
    const plan = this.aiPlan();
    if (!plan || !plan.days) return 0;

    let total = 0;
    plan.days.forEach((day: any) => {
      day.activities.forEach((act: any) => {
        total += act.estimatedCost || 0;
      });
    });
    return total;
  });

  isOverBudget = computed(() => this.totalAiCost() > this.maxBudget);

  async generateTrip() {
    if (!this.city || !this.startDate || !this.endDate) {
      alert('Παρακαλώ συμπληρώστε Προορισμό, Έναρξη και Λήξη.');
      return;
    }

    this.isPlanning.set(true);
    this.aiPlan.set(null);

    const requestBody = {
      city: this.city,
      mood: this.selectedMood,
      totalBudget: Number(this.maxBudget),
      numberOfPeople: Number(this.numberOfPeople),
      startDate: new Date(this.startDate).toISOString(),
      endDate: new Date(this.endDate).toISOString(),
    };

    try {
      const response = await firstValueFrom(
        this.http.post<any>(`${this.apiUrl}/generate-mood`, requestBody),
      );
      this.aiPlan.set(response.plan);
    } catch (error: any) {
      console.error('AI Error:', error);
      alert(
        'Σφάλμα AI: Βεβαιωθείτε ότι το μοντέλο στο Backend είναι το llama-3.3-70b-versatile.',
      );
    } finally {
      this.isPlanning.set(false);
    }
  }

  async saveFullTrip() {
    if (!this.aiPlan()) return;

    this.isSaving.set(true);

    const saveDto = {
      title: `AI Trip to ${this.city}`,
      city: this.city,
      startDate: new Date(this.startDate).toISOString(),
      endDate: new Date(this.endDate).toISOString(),
      totalBudget: Number(this.maxBudget),
      numberOfPeople: Number(this.numberOfPeople),
      totalCost: this.totalAiCost(),
      days: this.aiPlan().days,
    };

    try {
      await firstValueFrom(
        this.http.post(`${this.apiUrl}/save-ai-trip`, saveDto),
      );
      this.showSuccess.set(true);
      setTimeout(() => this.showSuccess.set(false), 5000);
    } catch (error: any) {
      console.error('Save Error:', error);
      alert(
        'Αποτυχία αποθήκευσης. Ελέγξτε αν το BusinessId στη βάση είναι Nullable.',
      );
    } finally {
      this.isSaving.set(false);
    }
  }
}
