import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UserProfileService } from '../../services/userProfile/user-profile-service';

@Component({
  selector: 'app-topnav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './uppernav.component.html',
  styleUrls: ['./uppernav.component.css']
})
export class TopnavComponent {

  // TODO: replace with data from AuthService/UserService
  username = '';
  showNotifications = false;
  showUserMenu = false;
  hasNotifications = true;

  // TODO: replace with real notifications from NotificationService
  notifications = [];

  get initials(): string {
    return this.username
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  constructor(private router: Router, private userService: UserProfileService, private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.userService.userInfo().subscribe({
      next: (user: any) => {
        const fulluser = Array.isArray(user.user) ? user.user[0] : user.user
        this.username = fulluser.username
        this.cdr.detectChanges()
      }
    })
  }
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