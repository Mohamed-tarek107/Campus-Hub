import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { TopnavComponent } from '../uppernav/uppernav.component';
import { UserProfileService } from '../../services/userProfile/user-profile-service';
import { StudentService } from '../../services/studentRoute/student-service';
import { AdminPanelService } from '../../services/admin/admin-panel';


interface Announcement {
  title: string;
  source: string;
  date: string;
}

interface Task {
  title: string;
  course_name: string;
  deadline: string;
  status: 'pending' | 'done';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SidenavComponent, TopnavComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // ── User ──────────────────────────────────────────────
  username = '';                  // TODO: get from AuthService

  // ── Stats ─────────────────────────────────────────────
  currentGpa: number | string = 0;   // TODO: get from GPA service/API
  enrolledCount = 0;                 // TODO: get from student courses API
  pendingTasksCount = 0;             // TODO: get from student tasks API
  doneTasksCount = 0;                // TODO: get from student tasks API

  // ── Data ──────────────────────────────────────────────
  announcements: Announcement[] = [];   // TODO: GET /api/announcements
  upcomingTasks: Task[] = [];           // TODO: GET /api/student/tasks (filtered pending)

  // ── Computed: GPA label and CSS class ─────────────────
  get gpaLabel(): string {
    const gpa = parseFloat(String(this.currentGpa));
    if (gpa >= 3.7) return 'Excellent';
    if (gpa >= 3.0) return 'Very Good';
    if (gpa >= 2.5) return 'Good';
    if (gpa >= 2.0) return 'Pass';
    return 'Fail';
  }

  get gpaClass(): string {
    const gpa = parseFloat(String(this.currentGpa));
    if (gpa >= 3.7) return 'gpa-excellent';
    if (gpa >= 3.0) return 'gpa-very-good';
    if (gpa >= 2.5) return 'gpa-good';
    if (gpa >= 2.0) return 'gpa-pass';
    return 'gpa-fail';
  }

  constructor(private userService: UserProfileService, private studentService: StudentService, private adminService: AdminPanelService){}
  ngOnInit(): void {
    // TODO: load username
    // TODO: GET /api/student/gpa → set currentGpa
    this.userService.userInfo().subscribe({ 
      next: (data: any) => { 
        this.username = data.user.username
        this.currentGpa = data.user.gpa
      }})
    // TODO: GET /api/student/courses → set enrolledCount
    this.studentService.viewAllstudent_courses().subscribe({ next: (data: any) => { this.enrolledCount = data.length } })
    // TODO: GET /api/student/tasks → count pending/done, populate upcomingTasks
    this.studentService.viewAllstudent_tasks().subscribe({ 
      next: (data: any) => {
        this.upcomingTasks = data.tasks.filter((t: any) => t.status === 'pending');
        this.pendingTasksCount = data.tasks.filter((t: any) => t.status === 'pending').length;
        this.doneTasksCount = data.tasks.filter((t: any) => t.status === 'done').length;
      }
    })
    // TODO: GET /api/announcements → populate announcements
    this.adminService.listAllAnnouncements().subscribe({ next: (data: any) => { this.announcements = data.announcements ?? [] }})
  }
}