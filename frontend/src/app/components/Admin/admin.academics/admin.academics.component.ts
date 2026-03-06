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

  courses: Course[] = [
    { course_name: 'Data Structures', department: 'bis', year: 2, doctors: ['Dr. Ahmed Hassan', 'Dr. Sara Kamel'] },
    { course_name: 'Database Systems', department: 'fmi', year: 3, doctors: ['Dr. Omar Fathy'] },
    { course_name: 'Web Development',  department: 'bis', year: 3, doctors: ['Dr. Layla Mahmoud'] },
  ];

  // ── Course Wizard ─────────────────────────────────────
  wizardOpen  = false;
  currentStep = 1;
  isLoading   = false;
  errorMsg    = '';

  form = { course_name: '', department: '' as string, year: '' as number | string, doctors: [''] };

  get wizardTitle() {
    return ['Course Details', 'Assign Doctors', 'Review'][this.currentStep - 1];
  }

  get filledDoctors() {
    return this.form.doctors.filter(d => d.trim() !== '');
  }

  // ── Fix: trackBy prevents re-render on every keystroke ──
  trackByIndex(index: number) { return index; }

  openWizard() {
    this.wizardOpen = true; this.currentStep = 1; this.errorMsg = '';
    this.form = { course_name: '', department: '', year: '', doctors: [''] };
  }

  closeWizard() { this.wizardOpen = false; }

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

  prevStep() { this.errorMsg = ''; this.currentStep--; }

  addDoctorField() { this.form.doctors.push(''); }

  removeDoctor(i: number) { this.form.doctors.splice(i, 1); }

  onSubmit() {
    this.isLoading = true; this.errorMsg = '';
    const payload = { course_name: this.form.course_name.trim(), department: this.form.department, year: Number(this.form.year), doctors: this.filledDoctors };

    // TODO:
    // POST /api/admin/courses with { course_name, department, year }
    // then for each doctor: POST /api/admin/courses/:id/doctors with { doctor_name }
    setTimeout(() => {
      this.courses.unshift({ ...payload });
      this.isLoading = false;
      this.closeWizard();
    }, 700);
  }

  deleteCourse(i: number) {
    // TODO: DELETE /api/admin/courses/:id
    this.courses.splice(i, 1);
  }

  // ── Add Doctor Popup ──────────────────────────────────
  doctorPopupOpen  = false;
  isDoctorLoading  = false;
  doctorErrorMsg   = '';
  doctorForm = { name: '', course_name: '' };

  openDoctorPopup() {
    this.doctorPopupOpen = true; this.doctorErrorMsg = '';
    this.doctorForm = { name: '', course_name: '' };
  }

  closeDoctorPopup() { this.doctorPopupOpen = false; }

  onAddDoctor() {
    this.doctorErrorMsg = '';
    if (!this.doctorForm.name.trim()) { this.doctorErrorMsg = 'Enter a doctor name.'; return; }
    if (!this.doctorForm.course_name)  { this.doctorErrorMsg = 'Select a course.'; return; }

    this.isDoctorLoading = true;

    // TODO: POST /api/admin/courses/:course_id/doctors with { doctor_name }
    setTimeout(() => {
      const course = this.courses.find(c => c.course_name === this.doctorForm.course_name);
      if (course) course.doctors.push(this.doctorForm.name.trim());
      this.isDoctorLoading = false;
      this.closeDoctorPopup();
    }, 500);
  }

  ngOnInit(): void {
    // TODO: GET /api/admin/courses → replace mock
  }
}
