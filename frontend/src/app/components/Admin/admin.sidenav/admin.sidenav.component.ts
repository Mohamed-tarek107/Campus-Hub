import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin.sidenav.component',
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.sidenav.component.html',
  styleUrl: './admin.sidenav.component.css',
})
export class AdminSidenavComponent {
  isCollapsed = false;

  toggle(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
