import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/toast/toast.component';
import { RefreshIndicatorComponent } from './shared/refresh-indicator/refresh-indicator.component';
import { IdleWarningComponent } from './shared/idle-warning/idle-warning.component';
import { AuthService } from './services/auth.service';
import { AutoLogoutService } from './services/autologout.service';

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
  private authService = inject(AuthService);
  private autoLogoutService = inject(AutoLogoutService);

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.autoLogoutService.startWatching();
    }
  }
}
