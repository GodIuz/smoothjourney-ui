import { Component } from '@angular/core';
import { CommonModule,Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  loginObj = {
    email: '',
    password: ''
  };

  rememberMe: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    this.isLoading = true;
    this.auth.login(this.loginObj).subscribe({
      next: (res) => {
        console.log('Ο Ρόλος που ήρθε είναι:', res.role);
        this.auth.storeToken(res.token, this.rememberMe);
        this.isLoading = true; 
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        console.log('Ρόλος χρήστη:', res.role);
        const roleLower = res.role.toString().toLowerCase();

        if (roleLower === 'admin') {
          console.log('Μπαίνω ως Admin...');
          this.router.navigate(['/admin/dashboard']);
        } else {
          console.log('Μπαίνω ως Κανονικός Χρήστης...');
          this.router.navigate(['/mainapp/home']); 
        }
      },
      error: (err) => {
        this.errorMessage = err.error || 'Κάτι πήγε στραβά.';
        this.isLoading = false;
      }
    });
  }

  
}