import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { TopnavComponent } from '../uppernav/uppernav.component';
import { UserProfileService } from '../../services/userProfile/user-profile-service';
import { StudentService } from '../../services/studentRoute/student-service';
import { AdminPanelService } from '../../services/admin/admin-panel';
import { GpaCalcService } from '../../services/gpaCalc/gpa-calc-service';


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
  imports: [CommonModule, FormsModule, RouterModule, SidenavComponent, TopnavComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // ── User ──────────────────────────────────────────────
  username = '';                  // TODO: get from AuthService

  // ── Stats ─────────────────────────────────────────────
  currentGpa = 0;
  enrolledCount = 0;                 // TODO: get from student courses API
  pendingTasksCount = 0;             // TODO: get from student tasks API
  doneTasksCount = 0;                // TODO: get from student tasks API

  isEditingGpa = false;
  isSavingGpa = false;
  gpaInput = 0;
  gpaMessage = '';
  gpaError = '';

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

  constructor(
    private userService: UserProfileService,
    private studentService: StudentService,
    private adminService: AdminPanelService,
    private gpaService: GpaCalcService,
    private cdr: ChangeDetectorRef
  ){}
  ngOnInit(): void {
    // TODO: load username
    // TODO: GET /api/student/gpa → set currentGpa
    this.userService.userInfo().subscribe({ 
      next: (data: any) => { 
        const user = Array.isArray(data.user) ? data.user[0] : data.user;
        this.username = user?.username ?? '';
        this.currentGpa = Number(user?.gpa ?? 0);
        this.gpaInput = this.currentGpa;
        this.cdr.detectChanges();
      },
      error: () => {
        this.currentGpa = 0;
        this.gpaInput = 0;
        this.cdr.detectChanges();
      }
    })
    // TODO: GET /api/student/courses → set enrolledCount
    this.studentService.viewAllstudent_courses().subscribe({ next: (data: any) => { 
      this.enrolledCount = data.courses?.length ?? 0;
      this.cdr.detectChanges();
    }, error: () => {
      this.enrolledCount = 0;
      this.cdr.detectChanges();
    }})
    // TODO: GET /api/student/tasks → count pending/done, populate upcomingTasks
    this.studentService.viewAllstudent_tasks().subscribe({ 
      next: (data: any) => {
        const tasks = data.studentTasks ?? data.tasks ?? [];
        this.upcomingTasks = tasks.filter((t: any) => (t.status ?? 'pending') === 'pending');
        this.pendingTasksCount = tasks.filter((t: any) => (t.status ?? 'pending') === 'pending').length;
        this.doneTasksCount = tasks.filter((t: any) => t.status === 'done').length;
        this.cdr.detectChanges();
      },
      error: () => {
        this.upcomingTasks = [];
        this.pendingTasksCount = 0;
        this.doneTasksCount = 0;
        this.cdr.detectChanges();
      }
    })
    // TODO: GET /api/announcements → populate announcements
    this.adminService.listAllAnnouncements().subscribe({ next: (data: any) => { 
      this.announcements = data.announcements ?? []
      this.cdr.detectChanges();
    }})
  }

  formatGpa(value: number): string {
    return Number(value || 0).toFixed(2);
  }

  openGpaEditor(): void {
    this.gpaError = '';
    this.gpaMessage = '';
    this.gpaInput = Number(this.currentGpa || 0);
    this.isEditingGpa = true;
    this.cdr.detectChanges();
  }

  cancelGpaEditor(): void {
    this.isEditingGpa = false;
    this.gpaError = '';
    this.gpaMessage = '';
    this.gpaInput = Number(this.currentGpa || 0);
    this.cdr.detectChanges();
  }

  saveGpa(): void {
    const nextGpa = Number(this.gpaInput);

    if (Number.isNaN(nextGpa) || nextGpa < 0 || nextGpa > 4) {
      this.gpaError = 'GPA must be between 0.00 and 4.00.';
      this.cdr.detectChanges();
      return;
    }

    this.isSavingGpa = true;
    this.gpaError = '';
    this.gpaMessage = '';

    this.gpaService.editUserGpa(nextGpa).subscribe({
      next: () => {
        this.currentGpa = nextGpa;
        this.isEditingGpa = false;
        this.gpaMessage = 'GPA updated successfully.';
        this.isSavingGpa = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.gpaError = err.error?.message ?? 'Failed to update GPA.';
        this.isSavingGpa = false;
        this.cdr.detectChanges();
      }
    });
  }
}