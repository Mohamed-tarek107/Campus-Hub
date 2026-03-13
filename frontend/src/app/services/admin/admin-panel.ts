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
  addCoursec() {

  }


  // Get all courses.
  listAllcourses() {

  }


  // Add a doctor.
  addDoctor() {

  }


  // Get doctors for a course.
  courseDoctors(course_id: number) {

  }


  // Add an assignment for a course doctor.
  addAssignment(courseDoctor_id: number) {

  }


  // Get all events.
  listAllEvents() {

  }


  // Add a new event.
  addEvent() {

  }

  // Get all announcements.
  listAllAnnouncements() {

  }

  // Add a new announcement.
  addAnnouncement() {

  }

  // Get all feedback items.
  listAllFeedbacks() {

  }

  // Load dashboard stats.
  dashboardStats() {

  }


  // Delete an event.
  deleteEvent(event_id: number) {

  }

  // Delete an announcement.
  deleteAnnouncement(announcement_id: number) {

  }

  // Delete a course.
  deleteCourse(course_id: number) {

  }
}
