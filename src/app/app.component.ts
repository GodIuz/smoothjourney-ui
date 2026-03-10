import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/toast/toast.component';
import { RefreshIndicatorComponent } from './shared/refresh-indicator/refresh-indicator.component';
import { IdleWarningComponent } from './shared/idle-warning/idle-warning.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ToastComponent,
    RefreshIndicatorComponent,
    IdleWarningComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    private AuthService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (
      !token &&
      window.location.pathname !== '/login' &&
      window.location.pathname !== '/register'
    ) {
      this.router.navigate(['/login']);
    } else if (token && window.location.pathname === '/') {
      this.router.navigate(['/mainapp/home']);
    }
  }
}
