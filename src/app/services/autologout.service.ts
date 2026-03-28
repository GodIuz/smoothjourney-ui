import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, fromEvent, merge, Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AutoLogoutService {
  private authService = inject(AuthService);
  private router = inject(Router);
  private readonly IDLE_TIME = 15 * 60 * 1000;
  private readonly COUNTDOWN_TIME = 60;
  private showWarningSubject = new BehaviorSubject<boolean>(false);
  public showWarning$ = this.showWarningSubject.asObservable();
  private countdownSubject = new BehaviorSubject<number>(this.COUNTDOWN_TIME);
  public countdown$ = this.countdownSubject.asObservable();
  private activitySubscription: Subscription | null = null;
  private countdownInterval: any;

  startWatching() {
    this.stopWatching();

    if (!this.authService.isLoggedIn()) return;

    const activityEvents$ = merge(
      fromEvent(document, 'mousemove'),
      fromEvent(document, 'keydown'),
      fromEvent(document, 'click'),
      fromEvent(document, 'scroll'),
    );

    this.activitySubscription = activityEvents$
      .pipe(switchMap(() => timer(this.IDLE_TIME)))
      .subscribe(() => {
        this.triggerWarning();
      });
  }

  stopWatching() {
    if (this.activitySubscription) {
      this.activitySubscription.unsubscribe();
    }
    clearInterval(this.countdownInterval);
  }

  private triggerWarning() {
    if (this.activitySubscription) {
      this.activitySubscription.unsubscribe();
    }

    this.showWarningSubject.next(true);
    let timeLeft = this.COUNTDOWN_TIME;
    this.countdownSubject.next(timeLeft);

    this.countdownInterval = setInterval(() => {
      timeLeft--;
      this.countdownSubject.next(timeLeft);

      if (timeLeft <= 0) {
        this.logoutUser();
      }
    }, 1000);
  }

  keepSessionAlive() {
    clearInterval(this.countdownInterval);
    this.showWarningSubject.next(false);
    this.startWatching();
  }

  logoutUser() {
    this.stopWatching();
    this.showWarningSubject.next(false);
    this.authService.logout();
  }

  resetTimer() {
    this.keepSessionAlive();
  }
}
