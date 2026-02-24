import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-topnav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './uppernav.component.html',
  styleUrls: ['./uppernav.component.css']
})
export class TopnavComponent {

  // TODO: replace with data from AuthService/UserService
  username = 'Mohamed Tarek';
  showNotifications = false;
  showUserMenu = false;
  hasNotifications = true;

  // TODO: replace with real notifications from NotificationService
  notifications = [
    { message: 'New assignment added: Binary Trees', time: '2 hours ago' },
    { message: 'Deadline approaching: Matrix Operations', time: '5 hours ago' },
  ];

  get initials(): string {
    return this.username
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  constructor(private router: Router) {}

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    this.showUserMenu = false;
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
    this.showNotifications = false;
  }

  onLogout() {
    this.showUserMenu = false;
    // TODO: call AuthService.logout() then navigate
    this.router.navigate(['/login']);
  }

  // Close dropdowns when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.avatar-wrap') && !target.closest('.user-dropdown')) {
      this.showUserMenu = false;
    }
    if (!target.closest('.icon-btn') && !target.closest('.notif-dropdown')) {
      this.showNotifications = false;
    }
  }
}