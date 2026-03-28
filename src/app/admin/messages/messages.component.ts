import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ContactMessage } from '../interfaces/contactmessage.interface';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
})
export class MessagesComponent implements OnInit {
  private http = inject(HttpClient);
  messages = signal<ContactMessage[]>([]);
  isLoading = signal(true);

  private apiUrl = 'https://localhost:7000/Contact';

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.isLoading.set(true);
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http
      .get<ContactMessage[]>(`${this.apiUrl}/all`, { headers })
      .subscribe({
        next: (data) => {
          this.messages.set(data);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error fetching messages:', err);
          this.isLoading.set(false);
        },
      });
  }

  deleteMessage(id: number) {
    if (confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το μήνυμα;')) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http.delete(`${this.apiUrl}/${id}`, { headers }).subscribe({
        next: () => {
          this.messages.update((msgs) => msgs.filter((m) => m.id !== id));
        },
        error: (err) => alert('Σφάλμα κατά τη διαγραφή.'),
      });
    }
  }
}
