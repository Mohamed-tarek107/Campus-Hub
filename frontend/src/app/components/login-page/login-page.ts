import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.css']
})
export class LoginPage {

  credentials = { username: '', password: '' };
  showPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(private router: Router) {}

  async onLogin() {
    if (!this.credentials.username || !this.credentials.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      // TODO: inject AuthService and call this.authService.login(this.credentials)
      // On success: this.router.navigate(['/dashboard']);
      console.log('Login payload:', this.credentials);
    } catch (error: any) {
      this.errorMessage = error?.message || 'Login failed. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}