import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoLogoutService } from '../../services/autologout.service';

@Component({
  selector: 'app-idle-warning',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './idle-warning.component.html',
  styleUrls: ['./idle-warning.component.css'],
})
export class IdleWarningComponent implements OnInit {
  isVisible = false;
  countdown = 60;

  constructor(private AutoLogoutService: AutoLogoutService) {}

  ngOnInit() {
    this.AutoLogoutService.showWarning$.subscribe(
      (visible) => (this.isVisible = visible),
    );
    this.AutoLogoutService.countdown$.subscribe(
      (time) => (this.countdown = time),
    );
  }

  stay() {
    this.AutoLogoutService.keepSessionAlive();
  }
  logout() {
    this.AutoLogoutService.resetTimer();
  }
}
