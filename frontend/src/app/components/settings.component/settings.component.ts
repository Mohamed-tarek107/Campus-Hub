import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { TopnavComponent } from '../uppernav/uppernav.component';
import { UserProfileService } from '../../services/userProfile/user-profile-service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, SidenavComponent, TopnavComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  isLoadingProfile = false;
  isLoadingPassword = false;
  isDeleting = false;
  showDeleteConfirm = false;
  successMsg = '';
  errorMsg = '';

  showCurrentPass = false;
  showNewPass = false;

  profileForm = {
    username: '',
    email: '',
    bio: '',
    department: 'bis',
    year: 1,
    gpa: 0.00
  };

  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  constructor(private router: Router, private userService: UserProfileService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.userService.userInfo().subscribe({
      next: (data: any) => {
        const u = data.user[0];
        this.profileForm = {
          username: u.username,
          email: u.email,
          bio: u.bio,
          department: u.department,
          year: u.year,
          gpa: u.gpa | 0.00
        };
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      }
    })
  }
  
  goToAssignDoctors(): void {
    this.router.navigate(['/assignDoctors']);
  }

  onSaveProfile(): void {
    this.clearMessages();
    this.isLoadingProfile = true

    this.userService.editInfo(
      this.profileForm.email,
      this.profileForm.username,
      this.profileForm.year,
      this.profileForm.bio
    ).subscribe({
      next: () => {
        this.successMsg = 'Profile updated successfully.'
        this.isLoadingProfile = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMsg = err.error?.message ?? 'Failed to update profile.';
        this.isLoadingProfile = false;
        this.cdr.detectChanges();
      }
    })
  }

  onChangePassword(): void {
    this.clearMessages();
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.errorMsg = 'New passwords do not match.';
      return;
    }
    this.isLoadingPassword = true;
    this.userService.changepass(
      this.passwordForm.currentPassword,
      this.passwordForm.newPassword,
      this.passwordForm.confirmPassword
    ).subscribe({
      next: () => {
        this.successMsg = 'Password changed successfully.';
        this.passwordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
        this.isLoadingPassword = false;
      },
      error: (err) => {
        this.errorMsg = err.error?.message ?? 'Failed to change password.';
        this.isLoadingPassword = false;
      }
    })
  }

  onDeleteAccount(): void {
    this.isDeleting = true;
    this.userService.deleteAccount().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isDeleting = false;
        this.errorMsg = err.error?.message ?? 'Could not delete account.';
      }
    });
  }


  private clearMessages(): void {
    this.successMsg = '';
    this.errorMsg = '';
  }
}