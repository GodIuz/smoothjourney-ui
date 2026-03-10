import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-refresh-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './refresh-indicator.component.html',
  styleUrls: ['./refresh-indicator.component.css'],
})
export class RefreshIndicatorComponent implements OnInit, OnDestroy {
  isRefreshing = false;

  ngOnInit() {
    document.addEventListener(
      'token-refresh-start',
      () => (this.isRefreshing = true),
    );
    document.addEventListener('token-refresh-end', () =>
      setTimeout(() => (this.isRefreshing = false), 1000),
    );
  }

  ngOnDestroy() {
    document.removeEventListener('token-refresh-start', () => {});
    document.removeEventListener('token-refresh-end', () => {});
  }
}
