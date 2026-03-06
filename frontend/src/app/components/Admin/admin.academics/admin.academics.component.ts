import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminSidenavComponent } from '../admin.sidenav/admin.sidenav.component';
import { AdminTopnavComponent } from '../admin.topnav/admin.topnav.component';

interface Course {
  course_name: string;
  department:  string;
  year:        number;
  doctors:     string[];
}


@Component({
  selector: 'app-admin.academics.component',
  imports: [CommonModule, FormsModule, RouterModule, AdminSidenavComponent, AdminTopnavComponent],
  templateUrl: './admin.academics.component.html',
  styleUrl: './admin.academics.component.css',
})
export class AdminAcademicsComponent implements OnInit {

  // ── Courses list ──────────────────────────────────────
  // TODO: replace with GET /api/admin/courses
  courses: Course[] = [
    { course_name: 'Data Structures', department: 'bis', year: 2, doctors: ['Dr. Ahmed Hassan', 'Dr. Sara Kamel'] },
    { course_name: 'Database Systems', department: 'fmi', year: 3, doctors: ['Dr. Omar Fathy'] },
    { course_name: 'Web Development',  department: 'bis', year: 3, doctors: ['Dr. Layla Mahmoud', 'Dr. Nour El-Din'] },
  ];

  // ── Wizard state ──────────────────────────────────────
  wizardOpen   = false;
  currentStep  = 1;
  isLoading    = false;
  errorMsg     = '';

  form = {
    course_name: '',
    department:  '' as string,
    year:        '' as number | string,
    doctors:     [''] as string[]
  };

  // ── Computed ──────────────────────────────────────────
  get wizardTitle(): string {
    if (this.currentStep === 1) return 'Course Details';
    if (this.currentStep === 2) return 'Assign Doctors';
    return 'Review';
  }

  get filledDoctors(): string[] {
    return this.form.doctors.filter(d => d.trim() !== '');
  }

  ngOnInit(): void {
    // TODO: GET /api/admin/courses → replace mock courses
  }

  // ── Wizard controls ───────────────────────────────────
  openWizard(): void {
    this.wizardOpen  = true;
    this.currentStep = 1;
    this.errorMsg    = '';
    this.form = { course_name: '', department: '', year: '', doctors: [''] };
  }

  closeWizard(): void {
    this.wizardOpen = false;
  }

  nextStep(): void {
    this.errorMsg = '';

    if (this.currentStep === 1) {
      if (!this.form.course_name.trim() || !this.form.department || !this.form.year) {
        this.errorMsg = 'Please fill in all fields.';
        return;
      }
    }

    if (this.currentStep === 2) {
      if (this.filledDoctors.length === 0) {
        this.errorMsg = 'Add at least one doctor.';
        return;
      }
    }

    this.currentStep++;
  }

  prevStep(): void {
    this.errorMsg = '';
    this.currentStep--;
  }

  // ── Doctor fields ─────────────────────────────────────
  addDoctorField(): void {
    this.form.doctors.push('');
  }

  removeDoctor(index: number): void {
    this.form.doctors.splice(index, 1);
  }

  // ── Submit ────────────────────────────────────────────
  onSubmit(): void {
    this.isLoading = true;
    this.errorMsg  = '';

    const payload = {
      course_name: this.form.course_name.trim(),
      department:  this.form.department,
      year:        Number(this.form.year),
      doctors:     this.filledDoctors
    };

    // TODO when service ready:
    // STEP 1 — POST /api/admin/courses with { course_name, department, year }
    // STEP 2 — for each doctor in payload.doctors:
    //           POST /api/admin/courses/:course_id/doctors with { doctor_name }
    // on success → push to this.courses and closeWizard()
    // on error   → this.errorMsg = err.error?.message

    // MOCK — adds directly to the local list
    setTimeout(() => {
      this.courses.unshift({ ...payload });
      this.isLoading = false;
      this.closeWizard();
    }, 700);
  }
}
