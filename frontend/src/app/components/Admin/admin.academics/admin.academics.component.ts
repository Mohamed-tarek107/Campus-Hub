import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminSidenavComponent } from '../admin.sidenav/admin.sidenav.component';
import { AdminTopnavComponent } from '../admin.topnav/admin.topnav.component';
import { AdminPanelService } from '../../../services/admin/admin-panel';
import { catchError, finalize, forkJoin, map, of, switchMap } from 'rxjs';

interface Course {
  id: number;
  course_name: string;
  department: string;
  year: number;
  doctors?: string[];
}

// ─────────────────────────────────────────────────────────
@Component({
  selector: 'app-admin-academics',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidenavComponent, AdminTopnavComponent],
  templateUrl: './admin.academics.component.html',
  styleUrl: './admin.academics.component.css',
})
export class AdminAcademicsComponent implements OnInit {

  // ── Data ─────────────────────────────────────────────
  courses: Course[] = [];

  // ── Course wizard state ───────────────────────────────
  wizardOpen = false;
  currentStep = 1;
  isLoading = false;
  errorMsg = '';
  form = { course_name: '', department: '' as string, year: '' as number | string, doctors: [''] };

  // ── Add doctor popup state ────────────────────────────
  doctorPopupOpen = false;
  isDoctorLoading = false;
  doctorErrorMsg = '';
  doctorForm = { name: '', course_name: '' };

  constructor(private adminService: AdminPanelService, private cdr: ChangeDetectorRef) { }

  // ═════════════════════════════════════════════════════
  // API INTEGRATION POINTS
  // ═════════════════════════════════════════════════════

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.isLoading = true;

    this.adminService.listAllcourses().pipe(

      // switchMap: takes the courses response and immediately starts a new
      // set of API calls (doctor calls) before passing the result to subscribe
      switchMap((data: any) => {
        // Map raw API response into Course objects with an empty doctors array
        const baseCourses: Course[] = (data.courses ?? []).map((c: any) => ({ ...c, doctors: [] }));

        // If no courses exist, skip doctor calls and return empty array immediately
        if (baseCourses.length === 0) return of(baseCourses);

        // forkJoin: fires all doctor calls in parallel and waits for ALL of them
        // to finish before continuing — like Promise.all()
        return forkJoin(
          baseCourses.map((course) =>
            this.adminService.courseDoctors(course.id).pipe(

              // map: transform the doctor response into a course object
              // that has the doctors array filled in
              map((res: any) => ({
                ...course,
                doctors: (res.doctors ?? []).map((doc: any) => doc.name)
              })),

              // catchError: if a course has no doctors the API returns 404
              // instead of crashing everything, return the course with empty doctors
              catchError((err) => {
                console.error(err.message ? err.message : err);
                return of(course); // of() wraps a plain value into an Observable
              })
            )
          )
        );``
      }),

      // finalize: runs after everything is done whether it succeeded or failed
      // used here to turn off the loading spinner
      finalize(() => { this.isLoading = false; })

    ).subscribe({
      next: (courses: Course[]) => {
        // Set the courses array — Angular now has all courses with their doctors
        this.courses = courses;
        // Manually tell Angular to re-render because forkJoin runs outside
        // Angular's change detection zone in some configurations
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err.message ? err.message : err);
        this.errorMsg = err.error?.message;
      }
    });
  }

  submitCourse() {
    this.isLoading = true; this.errorMsg = '';
    const payload = {
      course_name: this.form.course_name.trim(),
      department: this.form.department,
      year: Number(this.form.year),
      doctors: this.filledDoctors
    };

    this.adminService.addCourse(payload.course_name, payload.department, payload.year)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }))

      .subscribe({
        next: (res: any) => {
          //doctors inside course creation
          payload.doctors.forEach((doc) => {
            this.adminService.addDoctor(res.course_id, doc)
              .subscribe({
                next: () => { },
                error: (err) => {
                  console.error(err)
                }
              })
          })

          this.courses.unshift({ ...payload, id: res.course_id })
          this.closeWizard()
        },
        error: (err) => {
          this.errorMsg = err.error?.message
        }
      })
  }

  deleteCourse(i: number) {
    const course = this.courses[i];
    if (!course?.id) {
      console.error('Invalid course id');
      return;
    }
    this.isLoading = true
    this.adminService.deleteCourse(course.id).pipe(
      finalize(() => {
        this.isLoading = false
      })
    ).subscribe({
      next: () => {
        this.courses.splice(i, 1)
      },
      error: (err) => {
        console.error(err.message ? err.message : err)
        this.errorMsg = err.error?.message
      }
    })
  }

  submitDoctor() {
    this.doctorErrorMsg = '';
    if (!this.doctorForm.name.trim()) { this.doctorErrorMsg = 'Enter a doctor name.'; return; }
    if (!this.doctorForm.course_name) { this.doctorErrorMsg = 'Select a course.'; return; }
    this.isDoctorLoading = true;

    const course = this.courses.find(c => c.course_name === this.doctorForm.course_name);

    this.adminService.addDoctor(course!.id!, this.doctorForm.name.trim())
      .pipe(
        finalize(() => {
          this.isDoctorLoading = false;
        })
      )
      .subscribe({
        next: () => {
          course?.doctors?.push(this.doctorForm.name.trim());
          this.closeDoctorPopup();
        },
        error: (err) => {
          this.doctorErrorMsg = err.error?.message;
          this.errorMsg = err.error?.message
        }
      });
  }

  // ═════════════════════════════════════════════════════
  // UI HELPERS — do not touch
  // ═════════════════════════════════════════════════════

  get wizardTitle() { return ['Course Details', 'Assign Doctors', 'Review'][this.currentStep - 1]; }
  get filledDoctors() { return this.form.doctors.filter(d => d.trim() !== ''); }
  trackByIndex(index: number) { return index; }

  openWizard() {
    this.wizardOpen = true; this.currentStep = 1; this.errorMsg = '';
    this.form = { course_name: '', department: '', year: '', doctors: [''] };
  }
  closeWizard() { this.wizardOpen = false; }
  openDoctorPopup() { this.doctorPopupOpen = true; this.doctorErrorMsg = ''; this.doctorForm = { name: '', course_name: '' }; }
  closeDoctorPopup() { this.doctorPopupOpen = false; }
  addDoctorField() { this.form.doctors.push(''); }
  removeDoctor(i: number) { this.form.doctors.splice(i, 1); }
  prevStep() { this.errorMsg = ''; this.currentStep--; }

  nextStep() {
    this.errorMsg = '';
    if (this.currentStep === 1 && (!this.form.course_name.trim() || !this.form.department || !this.form.year)) {
      this.errorMsg = 'Please fill in all fields.'; return;
    }
    if (this.currentStep === 2 && this.filledDoctors.length === 0) {
      this.errorMsg = 'Add at least one doctor.'; return;
    }
    this.currentStep++;
  }
}