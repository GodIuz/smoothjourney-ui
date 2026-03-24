import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-sidebar',
  imports: [],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css',
})
export class AdminSidebarComponent {
  private router = inject(Router);
  constructor(private authService: AuthService) {}

  logout() {
    localStorage.removeItem('token');
    localStorage.setItem('role', '');
    this.authService.logout();
    console.log('User logged out successfully.');
    this.router.navigate(['/login']);
  }
}
