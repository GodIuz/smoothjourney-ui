import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer-mainapp',
  imports: [CommonModule,RouterModule],
  templateUrl: './footer-mainapp.component.html',
  styleUrl: './footer-mainapp.component.css'
})
export class FooterMainappComponent {
  socialNetworks = [
    { platform: 'Facebook', icon: 'fa-brands fa-facebook-f', url: 'https://facebook.com/smoothjourneyapp' },
    { platform: 'Instagram', icon: 'fa-brands fa-instagram', url: 'https://instagram.com/smoothjourney.gr' },
    { platform: 'Twitter', icon: 'fa-brands fa-twitter', url: 'https://twitter.com' },
    {platform: 'TikTok', icon: 'fa-brands fa-tiktok', url: 'https://tiktok.com/smoothjourney.gr' },
    { platform: 'Threads', icon: 'fa-brands fa-threads', url: 'https://threads.com/smoothjourney.gr' }
  ];

  infoLinks = [
    { label: 'Privacy Policy',   route: '/privacy-policy' },
    { label: 'Terms of Service', route: '/terms' },
    { label: 'Help Center',      route: '/contact' }
  ];

  currentYear: number = new Date().getFullYear();
}
