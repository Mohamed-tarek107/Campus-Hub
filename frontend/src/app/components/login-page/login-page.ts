import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth-service';
import { finalize } from 'rxjs';

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

  constructor(private router: Router, private authService: AuthService ) {}



  async onLogin() {
    if (!this.credentials.username || !this.credentials.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
      // TODO: inject AuthService and call this.authService.login(this.credentials)
      // this.router.navigate(['/dashboard']);
      // this.router.navigate(['/assignDoctors']);
      this.authService.login(this.credentials.username, this.credentials.password)
      .pipe(
        finalize (() => {
          this.isLoading = false
          console.log('Login payload:', this.credentials);
        })
      )  
      .subscribe({
          next: (user: any) => {
            if(user.role == 'admin'){
              this.router.navigate(['/admin/dashboard']);
            }else if(user.is_firstlogin == true){
              this.router.navigate(['/assignDoctors']);
            }else{
              this.router.navigate(['/dashboard']);
            }
          },
          error: (err) => {
            console.error(err.message ? err.message : err)
            this.errorMessage = err.error?.message
          }
        }
      )
      
      // On success: 

      // if(this.credentials.username == 'admin'){
      //   this.router.navigate(['/admin/dashboard']);
      // }else{
      //     this.router.navigate(['/dashboard']);
      // }
    }
}