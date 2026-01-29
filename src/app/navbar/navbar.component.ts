import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule,RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isMenuOpen: boolean = false;
  navItems = [
    { label: 'Διαμονή', link: '/hotels', icon: 'fa-bed' },
    { label: 'Εστιατόρια', link: '/restaurants', icon: 'fa-utensils' },
    { label: 'Αξιοθεατα', link: '/attractions', icon: 'fa-building-columns' },
    { label: 'Κλαμπς', link: '/nightlife', icon: 'fa-utensils' }
  ];

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
