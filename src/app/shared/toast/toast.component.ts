import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastMessage, ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
})
export class ToastComponent implements OnInit {
  toast: ToastMessage | null = null;

  constructor(private ΤoastService: ToastService) {}

  ngOnInit() {
    this.ΤoastService.message$.subscribe((msg: ToastMessage | null) => {
      this.toast = msg;
      if (msg) setTimeout(() => this.close(), 4000);
    });
  }

  close() {
    this.ΤoastService.clear();
  }
}
