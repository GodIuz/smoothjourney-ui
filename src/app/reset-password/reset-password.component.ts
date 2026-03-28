import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  private toastService = inject(ToastService);
  newPassword: string = '';
  confirmPassword: string = '';
  token: string = '';

  isLoading: boolean = false;
  message: string = '';
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'];
    if (!this.token) {
      this.toastService.showError('Το Link είναι άκυρο ή λειψό.');
    }
  }

  onSubmit() {
    if (this.newPassword !== this.confirmPassword) {
      this.toastService.showError('Οι κωδικοί δεν ταιριάζουν!');
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.auth.resetPassword(this.token, this.newPassword).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.toastService.showSuccess(
          'Ο κωδικός άλλαξε επιτυχώς! Μεταφορά στη σύνδεση...',
        );
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        this.isLoading = false;
        this.error =
          err.error ||
          this.toastService.showError('Το Link έχει λήξει ή είναι άκυρο.');
      },
    });
  }
}
