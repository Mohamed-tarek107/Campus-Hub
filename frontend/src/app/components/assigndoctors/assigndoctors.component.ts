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

  // ── Constants ─────────────────────────────────────────
  validDays      = ['monday','tuesday','wednesday','thursday','saturday','sunday'];
  validTimeSlots = ['08:00-10:00','10:00-12:00','12:00-14:00','14:00-16:00','16:00-18:00','18:00-20:00'];

  // ── State ─────────────────────────────────────────────
  selections:   Selection[] = [];
  isLoading    = false;
  errorMessage = '';

  // ── Computed ──────────────────────────────────────────
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
    // ── MOCK DATA — replace entirely when services are ready ──

    this.selections = [
      {
        course_id:   '1',
        course_name: 'Mathematics',
        doctor_name: '',
        day:         '',
        timeslot:    '',
        doctors: [
          { id: 'd1', name: 'Dr. Ahmed Hassan' },
          { id: 'd2', name: 'Dr. Sara Kamel'   },
        ]
      },
      {
        course_id:   '2',
        course_name: 'Data Structures',
        doctor_name: '',
        day:         '',
        timeslot:    '',
        doctors: [
          { id: 'd3', name: 'Dr. Omar Fathy'   },
          { id: 'd4', name: 'Dr. Nour El-Din'  },
        ]
      },
      {
        course_id:   '3',
        course_name: 'Web Development',
        doctor_name: '',
        day:         '',
        timeslot:    '',
        doctors: [
          { id: 'd5', name: 'Dr. Layla Mahmoud' },
        ]
      },
      {
        course_id:   '4',
        course_name: 'Database Systems',
        doctor_name: '',
        day:         '',
        timeslot:    '',
        doctors: [
          { id: 'd1', name: 'Dr. Ahmed Hassan' },
          { id: 'd6', name: 'Dr. Mona Saleh'   },
        ]
      },
      {
        course_id:   '5',
        course_name: 'Operating Systems',
        doctor_name: '',
        day:         '',
        timeslot:    '',
        doctors: [
          { id: 'd3', name: 'Dr. Omar Fathy' },
        ]
      },
      {
        course_id:   '6',
        course_name: 'Software Engineering',
        doctor_name: '',
        day:         '',
        timeslot:    '',
        doctors: [
          { id: 'd2', name: 'Dr. Sara Kamel'  },
          { id: 'd4', name: 'Dr. Nour El-Din' },
        ]
      },
    ];

    // ── SERVICE STEPS (uncomment and implement when ready) ────

    // STEP 1 — inject your CoursesService in the constructor:
    //   constructor(private coursesService: CoursesService, private router: Router) {}

    // STEP 2 — call GET /api/student/courses/available to get this student's courses:
    //   this.coursesService.getAvailable().subscribe(courses => {
    //     this.selections = courses.map(c => ({
    //       course_id:   c.id,
    //       course_name: c.course_name,
    //       doctor_name: '',
    //       day:         '',
    //       timeslot:    '',
    //       doctors:     []
    //     }));
    //
    //     // STEP 3 — for each course, fetch its available doctors:
    //     this.selections.forEach((sel, i) => {
    //       this.coursesService.getDoctors(sel.course_id).subscribe(doctors => {
    //         this.selections[i].doctors = doctors;
    //       });
    //     });
    //   });

    // ── FOR REASSIGN MODE (same component, different flow) ────

    // STEP 1 same as above but call getEnrolled() instead of getAvailable():
    //   this.coursesService.getEnrolled().subscribe(courses => {
    //     this.selections = courses.map(c => ({
    //       course_id:   c.course_id,
    //       course_name: c.course_name,
    //       doctor_name: c.doctor_name,   // ← pre-filled from existing enrollment
    //       day:         c.day,           // ← pre-filled
    //       timeslot:    c.timeslot,      // ← pre-filled
    //       doctors:     []
    //     }));
    //
    //     // STEP 2 — still need to load doctors per course for the dropdown options:
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

  onFieldChange(): void {
    // Triggers computed getters to re-evaluate — no extra logic needed
  }

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

    console.log('Submitting selections (mock):', body);

    // ── SERVICE STEPS ─────────────────────────────────────────

    // STEP 1 — inject StudentService in the constructor
    // STEP 2 — call the assign endpoint:
    //   this.studentService.assignDoctors(body).subscribe({
    //     next: () => {
    //       this.isLoading = false;
    //       this.router.navigate(['/dashboard']);
    //     },
    //     error: (err) => {
    //       this.isLoading    = false;
    //       this.errorMessage = err.error?.message || 'Something went wrong. Please try again.';
    //     }
    //   });

    // MOCK — remove this timeout once service is connected:
    setTimeout(() => {
      this.isLoading = false;
      // this.router.navigate(['/dashboard']);
    }, 1000);
  }
}