import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AutoLogoutService {
  private readonly IDLE_LIMIT = 14 * 60 * 1000;
  private readonly COUNTDOWN_TIME = 60;
  private timerId: any;
  private countdownInterval: any;
  private showWarningSource = new Subject<boolean>();
  public showWarning$ = this.showWarningSource.asObservable();

  private countdownSource = new Subject<number>();
  public countdown$ = this.countdownSource.asObservable();

  constructor(
    private router: Router,
    private authService: AuthService,
    private ngZone: NgZone,
  ) {
    this.setupActivityListeners();
    this.startTimer();
  }

  private setupActivityListeners() {
    this.ngZone.runOutsideAngular(() => {
      const events = ['mousemove', 'keydown', 'click', 'wheel', 'touchstart'];
      events.forEach((event) => {
        window.addEventListener(event, () => this.resetTimer());
      });
    });
  }

  public resetTimer() {
    if (this.countdownInterval) return;

    this.clearTimers();
    this.startTimer();
  }

  private startTimer() {
    this.timerId = setTimeout(() => {
      this.ngZone.run(() => this.initiateCountdown());
    }, this.IDLE_LIMIT);
  }

  private initiateCountdown() {
    this.showWarningSource.next(true);
    let timeLeft = this.COUNTDOWN_TIME;
    this.countdownSource.next(timeLeft);

    this.countdownInterval = setInterval(() => {
      timeLeft--;
      this.countdownSource.next(timeLeft);

      if (timeLeft <= 0) {
        this.forceLogout();
      }
    }, 1000);
  }

  public keepSessionAlive() {
    this.authService
      .refreshToken({
        refreshToken: localStorage.getItem('refreshToken') || '',
      })
      .subscribe({
        next: () => {
          this.showWarningSource.next(false);
          this.clearTimers();
          this.startTimer();
        },
        error: () => this.forceLogout(),
      });
  }

  public forceLogout() {
    this.clearTimers();
    this.showWarningSource.next(false);
    this.authService.logout();
  }

  private clearTimers() {
    if (this.timerId) clearTimeout(this.timerId);
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    this.countdownInterval = null;
  }
}
