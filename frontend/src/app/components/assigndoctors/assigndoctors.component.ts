import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Selection {
  course_id:   string;
  course_name: string;
  doctor_name: string;
  day:         string;
  timeslot:    string;
  doctors:     { id: string; name: string }[];
}

@Component({
  selector: 'app-assign-doctors',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './assigndoctors.component.html',
  styleUrls: ['./assigndoctors.component.css']
})
export class AssignDoctorsComponent implements OnInit {

  validDays      = ['monday','tuesday','wednesday','thursday','saturday','sunday'];
  validTimeSlots = ['08:00-10:00','10:00-12:00','12:00-14:00','14:00-16:00','16:00-18:00','18:00-20:00'];

  selections:   Selection[] = [];
  isLoading    = false;
  errorMessage = '';

  // true  → student came from settings, already has enrolled courses → pre-filled
  // false → first time, everything empty
  isEditMode = false;

  get completedCount(): number {
    return this.selections.filter((_, i) => this.isRowComplete(i)).length;
  }

  get progressPercent(): number {
    return this.selections.length === 0 ? 0 : (this.completedCount / this.selections.length) * 100;
  }

  get allComplete(): boolean {
    return this.selections.length > 0 && this.completedCount === this.selections.length;
  }

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {

    // ── HOW MODE DETECTION WORKS ──────────────────────────────
    // When services are ready, ngOnInit does ONE call:
    //   GET /api/student/courses  (the enrolled courses endpoint)
    //
    // If response returns rows with doctor_name/day/timeslot already filled
    //   → isEditMode = true  → pre-fill the dropdowns
    //
    // If response returns empty array (student has no enrollments yet)
    //   → isEditMode = false → call GET /api/student/courses/available instead
    //     and build empty rows so the student picks for the first time
    //
    // The component itself figures out the mode — settings doesn't need to pass anything.
    // ─────────────────────────────────────────────────────────

    // ── MOCK — replace with service calls when ready ──────────

    // Simulating: does this student already have enrolled courses?
    const alreadyEnrolled = true; // ← flip to false to test first-time mode

    if (alreadyEnrolled) {
      // EDIT MODE — student came from settings, pre-fill their existing selections
      this.isEditMode = true;

      this.selections = [
        {
          course_id:   '1',
          course_name: 'Mathematics',
          doctor_name: 'Dr. Ahmed Hassan',   // ← pre-filled from DB
          day:         'monday',             // ← pre-filled from DB
          timeslot:    '08:00-10:00',        // ← pre-filled from DB
          doctors: [
            { id: 'd1', name: 'Dr. Ahmed Hassan' },
            { id: 'd2', name: 'Dr. Sara Kamel'   },
          ]
        },
        {
          course_id:   '2',
          course_name: 'Data Structures',
          doctor_name: 'Dr. Omar Fathy',
          day:         'tuesday',
          timeslot:    '10:00-12:00',
          doctors: [
            { id: 'd3', name: 'Dr. Omar Fathy'  },
            { id: 'd4', name: 'Dr. Nour El-Din' },
          ]
        },
        {
          course_id:   '3',
          course_name: 'Web Development',
          doctor_name: 'Dr. Layla Mahmoud',
          day:         'wednesday',
          timeslot:    '12:00-14:00',
          doctors: [
            { id: 'd5', name: 'Dr. Layla Mahmoud' },
          ]
        },
        {
          course_id:   '4',
          course_name: 'Database Systems',
          doctor_name: 'Dr. Ahmed Hassan',
          day:         'thursday',
          timeslot:    '14:00-16:00',
          doctors: [
            { id: 'd1', name: 'Dr. Ahmed Hassan' },
            { id: 'd6', name: 'Dr. Mona Saleh'   },
          ]
        },
        {
          course_id:   '5',
          course_name: 'Operating Systems',
          doctor_name: 'Dr. Omar Fathy',
          day:         'saturday',
          timeslot:    '10:00-12:00',
          doctors: [
            { id: 'd3', name: 'Dr. Omar Fathy' },
          ]
        },
        {
          course_id:   '6',
          course_name: 'Software Engineering',
          doctor_name: 'Dr. Sara Kamel',
          day:         'sunday',
          timeslot:    '16:00-18:00',
          doctors: [
            { id: 'd2', name: 'Dr. Sara Kamel'  },
            { id: 'd4', name: 'Dr. Nour El-Din' },
          ]
        },
      ];

    } else {
      // FIRST TIME MODE — empty selections, student picks everything fresh
      this.isEditMode = false;

      this.selections = [
        { course_id: '1', course_name: 'Mathematics',          doctor_name: '', day: '', timeslot: '', doctors: [{ id: 'd1', name: 'Dr. Ahmed Hassan' }, { id: 'd2', name: 'Dr. Sara Kamel' }] },
        { course_id: '2', course_name: 'Data Structures',      doctor_name: '', day: '', timeslot: '', doctors: [{ id: 'd3', name: 'Dr. Omar Fathy' },   { id: 'd4', name: 'Dr. Nour El-Din' }] },
        { course_id: '3', course_name: 'Web Development',      doctor_name: '', day: '', timeslot: '', doctors: [{ id: 'd5', name: 'Dr. Layla Mahmoud' }] },
        { course_id: '4', course_name: 'Database Systems',     doctor_name: '', day: '', timeslot: '', doctors: [{ id: 'd1', name: 'Dr. Ahmed Hassan' }, { id: 'd6', name: 'Dr. Mona Saleh' }] },
        { course_id: '5', course_name: 'Operating Systems',    doctor_name: '', day: '', timeslot: '', doctors: [{ id: 'd3', name: 'Dr. Omar Fathy' }] },
        { course_id: '6', course_name: 'Software Engineering', doctor_name: '', day: '', timeslot: '', doctors: [{ id: 'd2', name: 'Dr. Sara Kamel' }, { id: 'd4', name: 'Dr. Nour El-Din' }] },
      ];
    }

    // ── SERVICE STEPS (replace mock above with this when ready) ──
    //
    // STEP 1 — inject CoursesService and StudentService in constructor
    //
    // STEP 2 — call enrolled courses:
    //   this.studentService.getEnrolledCourses().subscribe(enrolled => {
    //
    //     if (enrolled.length > 0) {
    //       // EDIT MODE — student already has selections, pre-fill them
    //       this.isEditMode = true;
    //       this.selections = enrolled.map(c => ({
    //         course_id:   c.course_id,
    //         course_name: c.course_name,
    //         doctor_name: c.doctor_name,   // from studentCourses join
    //         day:         c.day,
    //         timeslot:    c.timeslot,
    //         doctors:     []
    //       }));
    //     } else {
    //       // FIRST TIME MODE — no enrollments yet, load available courses
    //       this.isEditMode = false;
    //       this.studentService.getAvailableCourses().subscribe(available => {
    //         this.selections = available.map(c => ({
    //           course_id:   c.id,
    //           course_name: c.course_name,
    //           doctor_name: '', day: '', timeslot: '',
    //           doctors:     []
    //         }));
    //       });
    //     }
    //
    //     // STEP 3 — after either branch, load doctors per course:
    //     this.selections.forEach((sel, i) => {
    //       this.coursesService.getDoctors(sel.course_id).subscribe(doctors => {
    //         this.selections[i].doctors = doctors;
    //       });
    //     });
    //   });
  }

  isRowComplete(index: number): boolean {
    const sel = this.selections[index];
    return !!(sel.doctor_name && sel.day && sel.timeslot);
  }

  onFieldChange(): void {}

  onSubmit(): void {
    this.isLoading    = true;
    this.errorMessage = '';

    const body = {
      selections: this.selections.map(s => ({
        course_id:   s.course_id,
        doctor_name: s.doctor_name,
        day:         s.day,
        timeslot:    s.timeslot
      }))
    };

    console.log('Submitting:', body);

    // TODO when service ready:
    // Endpoint is the same whether first-time or edit — backend uses upsert logic:
    //   this.studentService.assignDoctors(body).subscribe({
    //     next: () => { this.isLoading = false; this.router.navigate(['/dashboard']); },
    //     error: (err) => { this.isLoading = false; this.errorMessage = err.error?.message || 'Something went wrong.'; }
    //   });

    // MOCK spinner
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }
}