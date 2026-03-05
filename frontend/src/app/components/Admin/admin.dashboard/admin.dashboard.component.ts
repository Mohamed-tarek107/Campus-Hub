import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminSidenavComponent } from '../admin.sidenav/admin.sidenav.component';
import { AdminTopnavComponent } from '../admin.topnav/admin.topnav.component';

@Component({
  selector: 'app-admin.dashboard.component',
  imports: [CommonModule, RouterModule, AdminSidenavComponent, AdminTopnavComponent],
  templateUrl: './admin.dashboard.component.html',
  styleUrl: './admin.dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {

  totalStudents = 0;
  totalDoctors  = 0;

  ngOnInit(): void {
    // TODO: GET /api/admin/stats → set totalStudents, totalDoctors
  }

}
