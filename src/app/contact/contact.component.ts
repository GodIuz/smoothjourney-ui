import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  contactForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required]],
    messageBody: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.pattern(
          /^(?!.*(ignore instructions|system prompt|αγνόησε οδηγίες)).*$/i,
        ),
      ],
    ],
  });
  formData = {
    name: '',
    email: '',
    subject: 'general',
    message: '',
  };

  isSubmitting = signal(false);
  isSuccess = signal(false);

  onSubmit() {
    if (this.contactForm.valid) {
      this.http
        .post('https://localhost:7000/Contact/send', this.contactForm.value)
        .subscribe({
          next: () => alert('Το μήνυμα στάλθηκε!'),
          error: () => alert('Σφάλμα κατά την αποστολή.'),
        });
    }
  }
}
