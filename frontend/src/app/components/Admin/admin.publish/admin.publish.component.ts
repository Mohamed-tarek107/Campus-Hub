import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSidenavComponent } from '../admin.sidenav/admin.sidenav.component';
import { AdminTopnavComponent } from '../admin.topnav/admin.topnav.component';
import { AdminPanelService } from '../../../services/admin/admin-panel';

interface Announcement { id: number; title: string; source: string; date: string; description: string; }
interface Event        { id: number; title: string; host: string; location: string; date: string; description: string; }
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
  announcements: Announcement[] = [];
  events: Event[] = [];
  courses: Course[] = [];

  // coursedoctors keyed by course_id — loaded when course is selected
  // TODO: GET /api/admin/courses/:course_id/doctors → populate filteredDoctors
  allCourseDoctors: { [course_id: number]: CourseDoctor[] } = {};
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


  constructor(private adminService: AdminPanelService, private cdr: ChangeDetectorRef){}

  ngOnInit(): void {
    // TODO: load announcements, events, courses from API
    this.adminService.listAllAnnouncements().subscribe({
        next: (res: any) => { this.announcements = res.announcements ?? []; this.cdr.detectChanges(); },
        error: (err) => console.error(err)
    });

    // load events
    this.adminService.listAllEvents().subscribe({
        next: (res: any) => { this.events = res.events ?? []; this.cdr.detectChanges(); },
        error: (err) => console.error(err)
    });

    // load courses for assignment dropdown
    this.adminService.listAllcourses().subscribe({
        next: (res: any) => { this.courses = res.courses ?? []; },
        error: (err) => console.error(err)
    });
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
    this.filteredDoctors = [];
    const id = Number(this.tForm.course_id);

    this.adminService.courseDoctors(id).subscribe({
        next: (res: any) => { this.filteredDoctors = res.doctors ?? []; },
        error: () => { this.filteredDoctors = []; }
    });
  }

  onSubmit() {
    this.errorMsg = '';

    if (this.popupType === 'announcement') {
      const { title, source, date, description } = this.aForm;
      if (!title || !source || !date || !description) { this.errorMsg = 'Please fill in all fields.'; return; }
      this.isLoading = true;

      this.adminService.addAnnouncement(title,description,source,date)
      .subscribe({
        next: (res: any) => {
            this.announcements.unshift({ id: res.announcement_id, ...this.aForm });
            this.isLoading = false;
            this.close();
        },
        error: (err) => {
          console.error(err.message ? err.message : err);
        }
      })
    }

    else if (this.popupType === 'event') {
      const { title, host, location, date, description } = this.eForm;
      if (!title || !host || !location || !date || !description) { this.errorMsg = 'Please fill in all fields.'; return; }
      this.isLoading = true;

      this.adminService.addEvent(title,description,location,host,date)
      .subscribe({
        next: (res: any) => {
            this.events.unshift({ id: res.event_id, ...this.eForm });
            this.isLoading = false;
            this.close();
        },
        error: (err) => {
          console.error(err.message ? err.message : err);
        }
      })

      
    }

    else if (this.popupType === 'assignment') {
      const { coursedoctor_id, title, type, deadline, details } = this.tForm;
      if (!coursedoctor_id || !title || !type || !deadline || !details) { this.errorMsg = 'Please fill in all fields.'; return; }
      this.isLoading = true;

      this.adminService.addAssignment(Number(coursedoctor_id),title,deadline,type as 'exam' | 'assignment' | 'project',details)
      .subscribe({
        next: () => {
            this.isLoading = false;
            this.close();
        },
        error: (err) => {
          console.error(err.message ? err.message : err);
        }
      })
    }
  }

  deleteAnnouncement(i: number) {
    // TODO: DELETE /api/admin/announcements/:announcement_id
    this.adminService.deleteAnnouncement(this.announcements[i].id).subscribe({
      next: () => {
        this.announcements.splice(i, 1);
      }
    })
    
  }

  deleteEvent(i: number) {
    // TODO: DELETE /api/admin/events/:event_id
    this.adminService.deleteEvent(this.events[i].id).subscribe({
      next: () => {
        this.events.splice(i, 1);
      }
    })
  }
}