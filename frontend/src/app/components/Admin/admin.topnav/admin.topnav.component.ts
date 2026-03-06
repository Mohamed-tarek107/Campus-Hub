import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-admin-topnav',
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.topnav.component.html',
  styleUrl: './admin.topnav.component.css',
})
export class AdminTopnavComponent {
    showUserMenu = false;

  constructor(private router: Router) {}

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  onLogout(): void {
    // TODO: clear admin token and navigate to login
    // this.authService.logout();
    this.router.navigate(['/login']);
  }

  BackToStudentPanel(): void {
    this.router.navigate(['/dashboard'])
  }
}
