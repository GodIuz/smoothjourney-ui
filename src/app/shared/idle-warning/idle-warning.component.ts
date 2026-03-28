import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoLogoutService } from '../../services/autologout.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-idle-warning',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './idle-warning.component.html',
  styleUrls: ['./idle-warning.component.css'],
})
export class IdleWarningComponent {
  private autoLogoutService = inject(AutoLogoutService);
  isVisible = toSignal(this.autoLogoutService.showWarning$, {
    initialValue: false,
  });
  countdown = toSignal(this.autoLogoutService.countdown$, { initialValue: 60 });

  stay() {
    this.autoLogoutService.keepSessionAlive();
  }

  logout() {
    this.autoLogoutService.logoutUser();
  }
}
