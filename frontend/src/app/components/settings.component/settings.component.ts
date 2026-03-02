import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

  // ── State ─────────────────────────────────────────────
  isLoadingProfile  = false;
  isLoadingPassword = false;
  successMsg = '';
  errorMsg   = '';

  showCurrentPass = false;
  showNewPass     = false;

  // ── Forms ─────────────────────────────────────────────
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

  ngOnInit(): void {
    // TODO: GET /api/student/profile → populate profileForm fields
  }

  onSaveProfile(): void {
    this.clearMessages();
    // TODO: PATCH /api/student/profile with profileForm
    // on success → successMsg = 'Profile updated successfully.'
    // on error   → errorMsg = error message
  }

  onChangePassword(): void {
    this.clearMessages();
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.errorMsg = 'New passwords do not match.';
      return;
    }
    // TODO: PATCH /api/student/password with { currentPassword, newPassword }
    // on success → successMsg = 'Password updated successfully.'
    // on error   → errorMsg = error message
  }

  private clearMessages(): void {
    this.successMsg = '';
    this.errorMsg   = '';
  }
}