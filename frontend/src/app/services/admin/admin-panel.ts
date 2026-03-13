import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/envoriment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AdminPanelService {
  // Main admin API endpoint.
  private readonly AdminApi = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  // Add a new course.
  addCourse(course_name: string, department: string, year: number) {
    return this.http.post(`${this.AdminApi}/addCourse`,
      { course_name, department, year },
      { withCredentials: true }
    );
  }

  // Add a doctor.
  addDoctor(course_id: number, doctor_name: string) {
    return this.http.post(`${this.AdminApi}/addDoctor`,
      { course_id, doctor_name },
      { withCredentials: true }
    );
  }

  // Get all courses.
  listAllcourses() {
    return this.http.get(`${this.AdminApi}/courses`,
      { withCredentials: true }
    );
  }

  // Get doctors for a course.
  courseDoctors(course_id: number) {
    return this.http.get(`${this.AdminApi}/courses/${course_id}/doctors`,
      { withCredentials: true }
    );
  }


  // Add an assignment for a course doctor.
  addAssignment(
    courseDoctor_id: number,
    title: string,
    deadline: string | Date,
    type: 'exam' | 'assignment' | 'project',
    details: string
  ) {
    return this.http.post(`${this.AdminApi}/coursedoctor/${courseDoctor_id}/tasks`,
      { title, deadline, type, details },
      { withCredentials: true }
    );
  }


  // Get all events.
  listAllEvents() {
    return this.http.get(`${this.AdminApi}/listAllEvents`,
      { withCredentials: true }
    );
  }


  // Add a new event.
  addEvent(title: string, description: string, location: string, host: string, date: Date) {
    return this.http.post(`${this.AdminApi}/addEvent`,
      { title, description, location, host, date },
      { withCredentials: true }
    );
  }

  // Add a new announcement.
  addAnnouncement(title: string, description: string, source: string, date: Date) {
    return this.http.post(`${this.AdminApi}/addAnnouncment`,
      { title, description, source, date },
      { withCredentials: true }
    );
  }

  // Get all announcements.
  listAllAnnouncements() {
    return this.http.get(`${this.AdminApi}/listAllAnnounces`,
      { withCredentials: true }
    );
  }


  // Get all feedback items.
  listAllFeedbacks() {
    return this.http.get(`${this.AdminApi}/listFeedbacks`,
      { withCredentials: true }
    );
  }

  // Load dashboard stats.
  dashboardStats() {
    return this.http.get(`${this.AdminApi}/dashbordStats`,
      { withCredentials: true }
    );
  }


  // Delete an event.
  deleteEvent(event_id: number) {
    return this.http.delete(`${this.AdminApi}/events/${event_id}`,
      { withCredentials: true }
    );
  }

  // Delete an announcement.
  deleteAnnouncement(announcement_id: number) {
    return this.http.delete(`${this.AdminApi}/announcements/${announcement_id}`,
      { withCredentials: true }
    );
  }

  // Delete a course.
  deleteCourse(course_id: number) {
    return this.http.delete(`${this.AdminApi}/courses/${course_id}`,
      { withCredentials: true }
    );
  }
}
