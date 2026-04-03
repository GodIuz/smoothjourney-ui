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

  user: any = {};
  myReviews: any[] = [];
  activeTab: string = 'overview';
  isLoading = false;
  isLoadingReviews = false;
  isLoadingPassword = false;
  isVerified = false; // Αυτό ελέγχει το loading του button
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
        this.user = data;
        // Συγχρονισμός ημερομηνιών βάσει των πεδίων του API (createAt / dateOfBirth)
        const rawRegistered = data.createAt || data.createOn;
        const rawDob = data.dateOfBirth;

        if (rawRegistered) this.user.registeredOn = new Date(rawRegistered);
        if (rawDob) this.user.dateOfBirth = new Date(rawDob);

        this.isLoading = false;
      },
      error: (err) => {
        this.toastService.showError('Σφάλμα κατά τη φόρτωση του προφίλ.');
        this.isLoading = false;
      },
    });
  }

  sendVerification() {
    this.isVerified = true; // Ξεκινάει το spinner
    const url = `${this.apiUrl}/Auth/send-verification-email`;
    const payload = { email: this.user.email };

    this.http.post(url, payload).subscribe({
      next: (res: any) => {
        this.toastService.showSuccess(res.message || 'Το email στάλθηκε!');

        if (res.message && res.message.includes('ήδη επαληθευτεί')) {
          this.user.emailConfirmed = true;
        }

        this.isVerified = false; // Σταματάει το spinner
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Αποτυχία αποστολής email.';
        this.toastService.showError(errorMsg);
        this.isVerified = false;
      }
    });
  }

  updateProfile() {
    this.isLoading = true;
    this.profileService.updateProfile(this.user).subscribe({
      next: () => {
        this.toastService.showSuccess('Το προφίλ ενημερώθηκε επιτυχώς!');
        this.isLoading = false;
        this.activeTab = 'overview';
      },
      error: () => {
        this.toastService.showError('Σφάλμα κατά την ενημέρωση.');
        this.isLoading = false;
      },
    });
  }

  changePassword() {
    if (!this.passwordData.currentPassword || !this.passwordData.newPassword || !this.passwordData.confirmPassword) {
      this.toastService.showError('Παρακαλώ συμπληρώστε όλα τα πεδία.');
      return;
    }
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.toastService.showError('Ο νέος κωδικός και η επιβεβαίωση δεν ταιριάζουν!');
      return;
    }

    this.isLoadingPassword = true;
    const payload = {
      currentPassword: this.passwordData.currentPassword,
      newPassword: this.passwordData.newPassword,
    };

    this.http.post(`${this.apiUrl}/Auth/change-password`, payload).subscribe({
      next: (res: any) => {
        this.toastService.showSuccess(res.message || 'Ο κωδικός άλλαξε επιτυχώς!');
        this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
        this.isLoadingPassword = false;
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Σφάλμα κατά την αλλαγή κωδικού.';
        this.toastService.showError(errorMsg);
        this.isLoadingPassword = false;
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
      error: () => {
        this.toastService.showError('Σφάλμα κατά τη φόρτωση των κριτικών.');
        this.isLoadingReviews = false;
      },
    });
  }

  getStarsArray(): number[] {
    return [1, 2, 3, 4, 5];
  }
}