import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminSidenavComponent } from '../admin.sidenav/admin.sidenav.component';
import { AdminTopnavComponent } from '../admin.topnav/admin.topnav.component';
import { AdminPanelService } from '../../../services/admin/admin-panel';

@Component({
  selector: 'app-admin.dashboard.component',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminSidenavComponent, AdminTopnavComponent],
  templateUrl: './admin.dashboard.component.html',
  styleUrl: './admin.dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {

  totalStudents = 0;
  totalDoctors  = 0;
  totalCourses = 0;

  constructor(private cdr: ChangeDetectorRef, private adminServie: AdminPanelService){}

  ngOnInit(): void {
    // TODO: GET /api/admin/stats → set totalStudents, totalDoctors
    this.adminServie.dashboardStats().subscribe({
      next: (data: any) => {
        this.totalCourses = data.courses_count
        this.totalDoctors = data.doctors_count
        this.totalStudents = data.students_count
        this.cdr.detectChanges();
      }, 
      error: (err) => {
        console.error(err.message ? err.message : err);
      }
    })
  }
}
