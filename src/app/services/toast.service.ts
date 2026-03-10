import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  text: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private messageSource = new BehaviorSubject<ToastMessage | null>(null);

  public message$ = this.messageSource.asObservable();

  constructor() {}

  showError(message: string) {
    this.messageSource.next({ text: message, type: 'error' });
  }

  showSuccess(message: string) {
    this.messageSource.next({ text: message, type: 'success' });
  }

  showInfo(message: string) {
    this.messageSource.next({ text: message, type: 'info' });
  }

  clear() {
    this.messageSource.next(null);
  }
}
