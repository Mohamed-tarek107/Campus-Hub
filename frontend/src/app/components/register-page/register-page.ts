import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth-service';
import { finalize } from 'rxjs';

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
    email: '',
    department: '',
    year: null as number | null,
    password: '',
    confirmpassword: ''
  };

  showPassword = false;
  showConfirm = false;
  isLoading = false;
  errorMessage = '';

  constructor(private router: Router, private authService: AuthService, private cdr: ChangeDetectorRef) { }

  async onRegister() {
    if (!this.form.username || !this.form.email ||
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
    // TODO: inject AuthService and call this.authService.register(this.form)
    // On success: this.router.navigate(['/login']);
    this.authService.register(
      this.form.username,
      this.form.email,
      this.form.password,
      this.form.confirmpassword,
      this.form.department,
      this.form.year
    )
      .pipe(
        finalize(() => {
          this.isLoading = false
          console.log('Register payload:', this.form);
        })
      ).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error(err.message ? err.message : err)
          this.errorMessage = err.error?.message
          this.cdr.detectChanges();
        }
      })
  }
}