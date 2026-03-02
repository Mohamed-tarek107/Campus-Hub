import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { TopnavComponent } from '../uppernav/uppernav.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, SidenavComponent, TopnavComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  isLoadingProfile  = false;
  isLoadingPassword = false;
  successMsg = '';
  errorMsg   = '';

  showCurrentPass = false;
  showNewPass     = false;

  profileForm = {
    username:     '',
    phone_number: '',
    department:   'bis',
    year:         1,
    bio:          ''
  };

  passwordForm = {
    currentPassword: '',
    newPassword:     '',
    confirmPassword: ''
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    // TODO: GET /api/student/profile → populate profileForm fields
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
    // TODO: PATCH /api/student/profile with profileForm
  }

  onChangePassword(): void {
    this.clearMessages();
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.errorMsg = 'New passwords do not match.';
      return;
    }
    // TODO: PATCH /api/student/password with { currentPassword, newPassword }
  }

  private clearMessages(): void {
    this.successMsg = '';
    this.errorMsg   = '';
  }
}