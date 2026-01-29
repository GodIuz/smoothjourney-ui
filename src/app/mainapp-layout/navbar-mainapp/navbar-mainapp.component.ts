import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar-mainapp',
  imports: [RouterModule,CommonModule],
  templateUrl: './navbar-mainapp.component.html',
  styleUrl: './navbar-mainapp.component.css'
})
export class NavbarMainappComponent {
  private router = inject(Router);
  
  isMenuOpen = false;
  isUserDropdownOpen = false;
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleUserDropdown() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  onLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}
