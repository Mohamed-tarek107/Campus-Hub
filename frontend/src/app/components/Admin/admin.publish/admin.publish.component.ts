import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSidenavComponent } from '../admin.sidenav/admin.sidenav.component';
import { AdminTopnavComponent } from '../admin.topnav/admin.topnav.component';

interface Announcement { id?: number; title: string; source: string; date: string; description: string; }
interface Event        { id?: number; title: string; host: string; location: string; date: string; description: string; }
interface Course       { id: number; course_name: string; department: string; year: number; }
interface CourseDoctor { coursedoctor_id: number; name: string; }

@Component({
  selector: 'app-admin-publish',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidenavComponent, AdminTopnavComponent],
  templateUrl: './admin.publish.component.html',
  styleUrls: ['./admin.publish.component.css']
})
export class AdminPublishComponent implements OnInit {

  activeTab: 'announcements' | 'events' = 'announcements';

  // TODO: replace mocks with GET /api/admin/announcements, GET /api/admin/events, GET /api/admin/courses
  announcements: Announcement[] = [
    { id: 1, title: 'Mid-Term Exam Schedule', source: "Dean's Office", date: '2026-03-01', description: 'Mid-term exams will be held from March 15 to March 20.' },
  ];

  events: Event[] = [
    { id: 1, title: 'Tech Career Fair', host: 'CS Department', location: 'Main Hall', date: '2026-03-10', description: 'Annual tech career fair with 20+ companies.' },
  ];

  courses: Course[] = [
    { id: 1, course_name: 'Data Structures', department: 'bis', year: 2 },
    { id: 2, course_name: 'Database Systems', department: 'fmi', year: 3 },
  ];

  // coursedoctors keyed by course_id — loaded when course is selected
  // TODO: GET /api/admin/courses/:course_id/doctors → populate filteredDoctors
  allCourseDoctors: { [course_id: number]: CourseDoctor[] } = {
    1: [{ coursedoctor_id: 10, name: 'Dr. Ahmed Hassan' }, { coursedoctor_id: 11, name: 'Dr. Sara Kamel' }],
    2: [{ coursedoctor_id: 12, name: 'Dr. Omar Fathy' }],
  };

  filteredDoctors: CourseDoctor[] = [];

  // ── Popup state ───────────────────────────────────────
  popupType: 'announcement' | 'event' | 'assignment' | null = null;
  isLoading = false;
  errorMsg  = '';

  aForm = { title: '', source: '', date: '', description: '' };
  eForm = { title: '', host: '', location: '', date: '', description: '' };
  tForm = { course_id: '' as number | string, coursedoctor_id: '' as number | string, title: '', type: '', deadline: '', details: '' };

  get popupTitle() {
    return { announcement: 'New Announcement', event: 'New Event', assignment: 'New Assignment' }[this.popupType!] ?? '';
  }

  ngOnInit(): void {
    // TODO: load announcements, events, courses from API
  }

  open(type: 'announcement' | 'event' | 'assignment') {
    this.popupType = type;
    this.errorMsg  = '';
    this.aForm = { title: '', source: '', date: '', description: '' };
    this.eForm = { title: '', host: '', location: '', date: '', description: '' };
    this.tForm = { course_id: '', coursedoctor_id: '', title: '', type: '', deadline: '', details: '' };
    this.filteredDoctors = [];
  }

  close() { this.popupType = null; }

  onCourseChange() {
    this.tForm.coursedoctor_id = '';
    const id = Number(this.tForm.course_id);
    this.filteredDoctors = this.allCourseDoctors[id] ?? [];
    // TODO: GET /api/admin/courses/:course_id/doctors → set filteredDoctors
  }

  onSubmit() {
    this.errorMsg = '';

    if (this.popupType === 'announcement') {
      const { title, source, date, description } = this.aForm;
      if (!title || !source || !date || !description) { this.errorMsg = 'Please fill in all fields.'; return; }
      this.isLoading = true;
      // TODO: POST /api/admin/announcements with { title, description, source, date }
      setTimeout(() => {
        this.announcements.unshift({ ...this.aForm });
        this.isLoading = false; this.close();
      }, 600);
    }

    else if (this.popupType === 'event') {
      const { title, host, location, date, description } = this.eForm;
      if (!title || !host || !location || !date || !description) { this.errorMsg = 'Please fill in all fields.'; return; }
      this.isLoading = true;
      // TODO: POST /api/admin/events with { title, description, location, host, date }
      setTimeout(() => {
        this.events.unshift({ ...this.eForm });
        this.isLoading = false; this.close();
      }, 600);
    }

    else if (this.popupType === 'assignment') {
      const { coursedoctor_id, title, type, deadline, details } = this.tForm;
      if (!coursedoctor_id || !title || !type || !deadline || !details) { this.errorMsg = 'Please fill in all fields.'; return; }
      this.isLoading = true;
      // TODO: POST /api/admin/assignments/:coursedoctor_id with { title, deadline, type, details }
      setTimeout(() => {
        this.isLoading = false; this.close();
      }, 600);
    }
  }

  deleteAnnouncement(i: number) {
    // TODO: DELETE /api/admin/announcements/:announcement_id
    this.announcements.splice(i, 1);
  }

  deleteEvent(i: number) {
    // TODO: DELETE /api/admin/events/:event_id
    this.events.splice(i, 1);
  }
}