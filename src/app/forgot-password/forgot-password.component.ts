import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  
  email: string = '';
  isLoading: boolean = false;
  message: string = '';
  error: string = '';

  constructor(private auth: AuthService) {}

  onSubmit() {
    console.log('Αίτημα επαναφοράς για:', this.email);
    this.isLoading = true;
    this.message = '';
    this.error = '';

    this.auth.forgotPassword(this.email).subscribe({
      next: (res: any) => {
        console.log('Επιτυχία:', res);
        this.isLoading = false;
        this.message = 'Ελέγξτε το email σας! Σας στείλαμε οδηγίες επαναφοράς.';
      },
      error: (err) => {
        console.error('Σφάλμα:', err);
        this.isLoading = false;
        this.error = 'Κάτι πήγε στραβά. Δοκιμάστε ξανά αργότερα.';
      }
    });
  }
}