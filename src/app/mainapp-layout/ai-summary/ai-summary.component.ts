import { Component, inject, Input, OnInit } from '@angular/core';
import { BusinessService } from '../../services/business.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ai-summary',
  imports: [CommonModule],
  templateUrl: './ai-summary.component.html',
  styleUrl: './ai-summary.component.css',
})
export class AiSummaryComponent implements OnInit {
  @Input() businessId!: number;
  private businessService = inject(BusinessService);
  summary: string = '';
  isLoading: boolean = true;
  hasError: boolean = false;

  ngOnInit(): void {
    this.loadAiSummary();
  }

  loadAiSummary(): void {
    if (!this.businessId) {
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.businessService.getReviewSummary(this.businessId).subscribe({
      next: (response) => {
        this.summary = response.summary;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('AI Summary Error:', err);
        this.isLoading = false;
        this.hasError = true;
      },
    });
  }
}
