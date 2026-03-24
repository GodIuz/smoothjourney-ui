import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Business, BusinessService } from '../services/business.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private apiUrl = 'https://localhost:7000';
  topBusinesses: Business[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  travelVibes = [
    {
      title: 'Relaxation',
      img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600',
    },
    {
      title: 'Adventure',
      img: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=600',
    },
    {
      title: 'Romantic',
      img: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600',
    },
    {
      title: 'Night Life',
      img: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=600',
    },
  ];
  showCookieBanner: boolean = true;
  showScrollBtn: boolean = false;

  plannerOptions = [
    {
      type: 'AI Planner',
      icon: 'fa-wand-magic-sparkles',
      title: 'Φτιάξτο για μένα',
      desc: 'Πείτε μας τι σας αρέσει και το AI θα δημιουργήσει το τέλειο πρόγραμμα σε δευτερόλεπτα.',
      action: 'Δοκιμή AI',
      color: 'linear-gradient(135deg, #667eea, #764ba2)',
      route: '/mainapp/ai-planner',
    },
    {
      type: 'Manual Planner',
      icon: 'fa-map',
      title: 'Θα το χτίσω μόνος μου',
      desc: 'Έχετε τον απόλυτο έλεγχο. Επιλέξτε αξιοθέατα και φτιάξτε τη διαδρομή σας βήμα-βήμα.',
      action: 'Έναρξη',
      color: 'linear-gradient(135deg, #34E0A1, #2bc48a)',
      route: '/mainapp/trip-maker',
    },
  ];

  openFaqIndex: number | null = null;

  faqs = [
    {
      question: 'Είναι το SmoothJourney δωρεάν;',
      answer:
        'Ναι! Η βασική χρήση του AI Planner και η ανάγνωση κριτικών είναι εντελώς δωρεάν για όλους.',
    },
    {
      question: 'Μπορώ να κάνω κράτηση ξενοδοχείων;',
      answer:
        'Όχι απευθείας. Είμαστε ένας έξυπνος ταξιδιωτικός οδηγός. Σας βοηθάμε να βρείτε τα καλύτερα μέρη. H λειτουργία κράτησης θα προστεθεί στο μέλλον.',
    },
    {
      question: 'Πώς λειτουργεί το AI Reviews Summary;',
      answer:
        'Το σύστημά μας "διαβάζει" εκατοντάδες σχόλια από διάφορες πηγές, αφαιρεί τα fake reviews και δημιουργεί μια σύντομη περίληψη με τα θετικά και τα αρνητικά.',
    },
  ];

  constructor(private businessService: BusinessService) {}

  ngOnInit() {
    if (localStorage.getItem('cookiesAccepted')) {
      this.showCookieBanner = false;
    }
    this.fetchTopBusinesses();
  }

  toggleFaq(index: number) {
    this.openFaqIndex = this.openFaqIndex === index ? null : index;
  }

  acceptCookies() {
    this.showCookieBanner = false;
    localStorage.setItem('cookiesAccepted', 'true');
  }

  declineCookies() {
    this.showCookieBanner = false;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollBtn = window.scrollY > 500;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  fetchTopBusinesses() {
    this.businessService.getTopBusinesses().subscribe({
      next: (data) => {
        this.topBusinesses = data;
        console.log('Top Businesses loaded:', data);
      },
      error: (err) => {
        console.error('Σφάλμα φόρτωσης επιχειρήσεων:', err);
      },
    });
  }
  getImageUrl(path: string | undefined): string {
    if (!path || path.trim() === '') {
      return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80';
    }

    if (path.startsWith('http')) return path;

    const cleanPath = path.replace(/\\/g, '/');
    return `${this.apiUrl}${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;
  }
}
