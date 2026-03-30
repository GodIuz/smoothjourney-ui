import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar-mainapp',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar-mainapp.component.html',
  styleUrl: './navbar-mainapp.component.css',
})
export class NavbarMainappComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private authService = inject(AuthService);
  
  username: string = '';
  isMenuOpen = false;
  isUserDropdownOpen = false;
  isMobileUserDropdownOpen = false;
  private sub: Subscription | null = null;

  ngOnInit() {
    // Σωστή σύνδεση με το AuthService για Real-time αλλαγή ονόματος
    this.sub = this.authService.username$.subscribe((name) => {
      this.username = name || 'User';
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (!this.isMenuOpen) {
      this.isMobileUserDropdownOpen = false;
    }
  }

  toggleUserDropdown(event: Event) {
    event.stopPropagation();
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  toggleMobileUserDropdown(event: Event) {
    event.stopPropagation();
    this.isMobileUserDropdownOpen = !this.isMobileUserDropdownOpen;
  }

  onLogout() {
    this.authService.logout();
    this.isUserDropdownOpen = false;
    this.isMenuOpen = false;
    this.router.navigate(['/login']);
  }
}
