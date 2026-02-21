import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register-page.html',
  styleUrls: ['./register-page.css']
})
export class RegisterPage {

  form = {
    username: '',
    phone_number: '',
    department: '',
    year: '',
    password: '',
    confirmpassword: ''
  };

  showPassword = false;
  showConfirm = false;
  isLoading = false;
  errorMessage = '';

  constructor(private router: Router) {}

  async onRegister() {
    if (!this.form.username || !this.form.phone_number ||
        !this.form.department || !this.form.year ||
        !this.form.password || !this.form.confirmpassword) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    if (this.form.password !== this.form.confirmpassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      // TODO: inject AuthService and call this.authService.register(this.form)
      // On success: this.router.navigate(['/login']);
      console.log('Register payload:', this.form);
    } catch (error: any) {
      this.errorMessage = error?.message || 'Registration failed. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}