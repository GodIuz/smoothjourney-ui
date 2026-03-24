import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  companyLinks = [
    { label: 'Σχετικά με εμάς', link: '/about' },
    { label: 'Επικοινωνία', link: '/contact' },
    { label: 'Όροι Χρήσης', link: '/terms' },
    { label: 'Πολιτική Απορρήτου', link: '/privacy-policy' },
    { label: 'Πολιτικη για τα cookies', link: '/cookie-policy' },
  ];

  socialLinks = [
    {
      platform: 'Facebook',
      icon: 'fa-facebook-f',
      url: 'https://facebook.com/smoothjourneyapp',
    },
    {
      platform: 'Instagram',
      icon: 'fa-instagram',
      url: 'https://instagram.com/smoothjourney.gr',
    },
    {
      platform: 'Twitter',
      icon: 'fa-twitter',
      url: 'https://twitter.com/smoothjourneyapp',
    },
    {
      platform: 'TikTok',
      icon: 'fa-tiktok',
      url: 'https://tiktok.com/smoothjourney.gr',
    },
    {
      platform: 'Threads',
      icon: 'fa-threads',
      url: 'https://threads.com/smoothjourney.gr',
    },
  ];

  currentYear = new Date().getFullYear();
}
