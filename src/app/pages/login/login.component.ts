import { Component, inject, OnInit } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(AuthService);
  private toastService = inject(ToastService);
  returnUrl: string = '/mainapp/home';

  loginObj = {
    email: '',
    password: '',
  };

  rememberMe: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';


  ngOnInit(): void {
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '/mainapp/home';
  }

  onLogin() {
    this.isLoading = true;
    this.errorMessage = '';

    this.auth.login(this.loginObj).subscribe({
      next: (res) => {
        console.log('Σύνδεση επιτυχής. Ρόλος:', res.role);
        this.auth.storeToken(res.token, this.rememberMe);
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);

        if (res.userName || res.username) {
          this.auth.setUsername(res.userName || res.username);
        }

        const returnUrl = this.route.snapshot.queryParams['returnUrl'];
        const roleLower = res.role.toString().toLowerCase();

        if (returnUrl) {
          console.log('Ανακατεύθυνση στο προηγούμενο URL:', returnUrl);
          this.router.navigateByUrl(returnUrl);
        } else if (roleLower === 'admin') {
          console.log('Είσοδος ως Admin...');
          this.router.navigate(['/admin/dashboard']);
        } else {
          console.log('Είσοδος ως Χρήστης...');
          this.router.navigate(['/mainapp/home']);
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Σφάλμα σύνδεσης:', err);
        this.errorMessage = err.error?.message || err.error;
        this.toastService.showError('Λάθος στοιχεία σύνδεσης.');
        this.isLoading = false;
      },
    });
  }
}
