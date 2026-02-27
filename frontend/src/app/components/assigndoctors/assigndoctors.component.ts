import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';


// Shape of each row in the form
interface Selection {
  course_id: string;
  doctor_name: string;
  day: string;
  timeslot: string;
  doctors: { id: string; name: string }[];   // loaded after course is picked
  loadingDoctors: boolean;
}


@Component({
  selector: 'app-assigndoctors.component',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './assigndoctors.component.html',
  styleUrl: './assigndoctors.component.css',
})
export class AssigndoctorsComponent implements OnInit {

  // ── Data ──────────────────────────────────────────────
  availableCourses: { id: string; course_name: string }[] = [];

  selections: Selection[] = Array.from({ length: 6 }, () => ({
    course_id: '',
    doctor_name: '',
    day: '',
    timeslot: '',
    doctors: [],
    loadingDoctors: false
  }));

  // ── Constants ─────────────────────────────────────────
  validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'saturday', 'sunday'];

  validTimeSlots = [
    '08:00-10:00',
    '10:00-12:00',
    '12:00-14:00',
    '14:00-16:00',
    '16:00-18:00',
    '18:00-20:00'
  ];

  // ── State ─────────────────────────────────────────────
  isLoading = false;
  errorMessage = '';

  // ── Computed ──────────────────────────────────────────
  get completedCount(): number {
    return this.selections.filter((_, i) => this.isRowComplete(i)).length;
  }

  get progressPercent(): number {
    return (this.completedCount / this.selections.length) * 100;
  }

  get allComplete(): boolean {
    return this.completedCount === this.selections.length;
  }

  constructor(private http: HttpClient, private router: Router) {}

  // ── Lifecycle ─────────────────────────────────────────
  ngOnInit(): void {
    // TODO: call GET /api/student/courses/available
    // populate this.availableCourses with response
  }

  // ── Methods ───────────────────────────────────────────

  // Called when student picks a course in a row
  // Fetches doctors for that course and stores them in selections[index].doctors
  onCourseSelected(course_id: string, index: number): void {
    // TODO: reset doctor/day/timeslot for this row
    // TODO: set selections[index].loadingDoctors = true
    // TODO: call GET /api/student/courses/:course_id/doctors
    // TODO: populate selections[index].doctors with response
    // TODO: set selections[index].loadingDoctors = false
  }

  // Returns true if all 4 fields in a row are filled
  isRowComplete(index: number): boolean {
    const sel = this.selections[index];
    return !!(sel.course_id && sel.doctor_name && sel.day && sel.timeslot);
  }

  // Called on submit button click
  // Sends all selections to POST /api/student/assign-doctors
  onSubmit(): void {
    // TODO: set isLoading = true
    // TODO: build body: { selections: this.selections.map(s => ({ course_id, doctor_name, day, timeslot })) }
    // TODO: call POST /api/student/assign-doctors
    // TODO: on success navigate to /dashboard
    // TODO: on error set errorMessage
    // TODO: finally set isLoading = false
  }

}
