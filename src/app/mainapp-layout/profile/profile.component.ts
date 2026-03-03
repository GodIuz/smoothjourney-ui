import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
  ],
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private profileService = inject(ProfileService);

  user: any = {};
  isLoading = false;
  activeTab: string = 'overview';

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
        this.isLoading = false;
      },
    });
  }

  updateProfile() {
    this.isLoading = true;
    this.profileService.updateProfile(this.user).subscribe({
      next: (res) => {
        alert('Το προφίλ ενημερώθηκε επιτυχώς!');
        this.isLoading = false;
        this.activeTab = 'overview';
      },
      error: (err) => {
        console.error(err);
        alert('Σφάλμα κατά την ενημέρωση.');
        this.isLoading = false;
      },
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
