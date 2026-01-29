import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BusinessService } from '../../services/business.service';

@Component({
  selector: 'app-admin-businesses',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './businesses.component.html',
  styleUrl: './businesses.component.css'
})
export class BusinessesComponent implements OnInit {
 private businessService = inject(BusinessService);
  
  businesses: any[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.businessService.getAllBusinesses().subscribe({
      next: (data) => {
        console.log('📦 Data received:', data);
        this.businesses = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Error fetching businesses:', err);
        this.isLoading = false;
      }
    });
  }

  onDelete(id: number) {
    if(confirm('Είστε σίγουρος ότι θέλετε να διαγράψετε αυτή την καταχώρηση; Η ενέργεια δεν αναιρείται.')) {
      this.businessService.deleteBusiness(id).subscribe({
        next: () => {
          this.businesses = this.businesses.filter(b => b.businessId !== id);
          alert('Η καταχώρηση διαγράφηκε επιτυχώς.');
        },
        error: (err) => {
          console.error('Delete error:', err);
          alert('Υπήρξε πρόβλημα κατά τη διαγραφή.');
        }
      });
    }
  }
}