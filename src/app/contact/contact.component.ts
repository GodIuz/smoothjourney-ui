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
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  isSubmitting = signal(false);
  isSuccess = signal(false);

  contactForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['general', [Validators.required]],
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

  onSubmit() {
    console.log('Η φόρμα είναι έγκυρη;', this.contactForm.valid);
    console.log('Δεδομένα προς αποστολή:', this.contactForm.value);

    if (this.contactForm.valid) {
      this.isSubmitting.set(true);

      const payload = {
        FirstName: this.contactForm.value.firstName,
        LastName: this.contactForm.value.lastName,
        Email: this.contactForm.value.email,
        Subject: this.contactForm.value.subject,
        MessageBody: this.contactForm.value.messageBody,
      };

      this.http.post('https://localhost:7000/Contact/send', payload).subscribe({
        next: (response) => {
          console.log('Success!', response);
          this.isSuccess.set(true);
          this.isSubmitting.set(false);
        },
        error: (err) => {
          console.error('API Error details:', err);
          alert(
            'Σφάλμα: ' +
              (err.error?.message || 'Δεν ήταν δυνατή η επικοινωνία με το API'),
          );
          this.isSubmitting.set(false);
        },
      });
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}
