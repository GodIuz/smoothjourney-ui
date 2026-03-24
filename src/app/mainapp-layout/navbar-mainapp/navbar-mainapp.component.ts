import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar-mainapp',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar-mainapp.component.html',
  styleUrl: './navbar-mainapp.component.css',
})
export class NavbarMainappComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  username: string = '';
  isMenuOpen = false;
  isUserDropdownOpen = false;
  isMobileUserDropdownOpen = false;

  toggleUserDropdown() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  toggleMobileUserDropdown() {
    this.isMobileUserDropdownOpen = !this.isMobileUserDropdownOpen;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (!this.isMenuOpen) {
      this.isMobileUserDropdownOpen = false;
    }
  }

  onLogout() {
    this.authService.logout();
    this.isUserDropdownOpen = false;
    this.isMenuOpen = false;
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    const storedName = localStorage.getItem('userName');
    this.authService.username$.subscribe((name) => {
      this.username = name;
    });
  }
}
