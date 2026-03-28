import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { ToastService } from '../../services/toast.service';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, RouterModule],
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private profileService = inject(ProfileService);
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  myReviews: any[] = [];
  user: any = {};
  isLoading = false;
  activeTab: string = 'overview';
  isLoadingReviews = false;
  isLoadingPassword = false;
  reviewsLoaded = false;
  private apiUrl = 'https://localhost:7000';
  passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.isLoading = true;
    this.profileService.getMyProfile().subscribe({
      next: (data: any) => {
        console.log('📦 Data from API:', data);
        this.user = data;
        const rawRegistered = data.createOn || data.createOn;
        const rawDob = data.dateOfBirth || data.DateOfBirth;

        if (rawRegistered) {
          this.user.registeredOn = new Date(rawRegistered);
          console.log('✅ Converted RegisteredOn:', this.user.registeredOn);
        } else {
          console.warn('⚠️ RegisteredOn is MISSING from API response');
        }

        if (rawDob) {
          this.user.dateOfBirth = new Date(rawDob);
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Error loading profile:', err);
        this.toastService.showError('Σφάλμα κατά τη φόρτωση του προφίλ.');
        this.isLoading = false;
      },
    });
  }

  updateProfile() {
    this.isLoading = true;
    this.profileService.updateProfile(this.user).subscribe({
      next: (res) => {
        this.toastService.showSuccess('Το προφίλ ενημερώθηκε επιτυχώς!');
        this.isLoading = false;
        this.activeTab = 'overview';
      },
      error: (err) => {
        console.error(err);
        this.toastService.showError('Σφάλμα κατά την ενημέρωση.');
        this.isLoading = false;
      },
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'reviews' && !this.reviewsLoaded) {
      this.loadMyReviews();
    }
  }

  loadMyReviews() {
    this.isLoadingReviews = true;
    this.http.get<any[]>(`${this.apiUrl}/Reviews/my-reviews`).subscribe({
      next: (data) => {
        this.myReviews = data;
        this.isLoadingReviews = false;
        this.reviewsLoaded = true;
      },
      error: (err) => {
        console.error('❌ Σφάλμα κατά τη φόρτωση των κριτικών:', err);
        this.toastService.showError('Σφάλμα κατά τη φόρτωση των κριτικών.');
        this.isLoadingReviews = false;
      },
    });
  }

  getStarsArray(): number[] {
    return [1, 2, 3, 4, 5];
  }

  changePassword() {
    if (
      !this.passwordData.currentPassword ||
      !this.passwordData.newPassword ||
      !this.passwordData.confirmPassword
    ) {
      this.toastService.showError('Παρακαλώ συμπληρώστε όλα τα πεδία.');
      return;
    }

    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.toastService.showError(
        'Ο νέος κωδικός και η επιβεβαίωση δεν ταιριάζουν!',
      );
      return;
    }

    this.isLoadingPassword = true;

    const payload = {
      currentPassword: this.passwordData.currentPassword,
      newPassword: this.passwordData.newPassword,
    };

    this.http.post(`${this.apiUrl}/Auth/change-password`, payload).subscribe({
      next: (res: any) => {
        this.toastService.showSuccess('Ο κωδικός σας άλλαξε επιτυχώς!');
        this.passwordData = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        };
        this.isLoadingPassword = false;
      },
      error: (err) => {
        console.error('Σφάλμα:', err);
        this.toastService.showError('Σφάλμα κατά την αλλαγή κωδικού.');
        this.isLoadingPassword = false;
      },
    });
  }
}
