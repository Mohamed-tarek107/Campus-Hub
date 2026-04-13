import { Component, OnInit } from '@angular/core';
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

  constructor(private router: Router, private userService: UserProfileService) { }

  ngOnInit(): void {
    // TODO: GET /api/student/profile → populate profileForm fields
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
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  // Navigates to assign-doctors.
  // Pass mode='edit' so the component knows to load existing selections.
  // Pass mode='assign' for first-time students (handled by is_firstlogin check server-side).
  // The assign-doctors component itself decides what to show based on whether
  // the student already has enrolled courses or not.
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
      },
      error: (err) => {
        this.errorMsg = err.error?.message ?? 'Failed to update profile.';
        this.isLoadingProfile = false;
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
      next: (err) => {
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