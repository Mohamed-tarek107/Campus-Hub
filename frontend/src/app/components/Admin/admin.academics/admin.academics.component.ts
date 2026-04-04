import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminSidenavComponent } from '../admin.sidenav/admin.sidenav.component';
import { AdminTopnavComponent } from '../admin.topnav/admin.topnav.component';
import { AdminPanelService } from '../../../services/admin/admin-panel';

interface Course {
  id?:         number;
  course_name: string;
  department:  string;
  year:        number;
  doctors:     string[];
}

// ─────────────────────────────────────────────────────────
@Component({
  selector: 'app-admin-academics',
  imports: [CommonModule, FormsModule, AdminSidenavComponent, AdminTopnavComponent],
  templateUrl: './admin.academics.component.html',
  styleUrl: './admin.academics.component.css',
})
export class AdminAcademicsComponent implements OnInit {

  // ── Data ─────────────────────────────────────────────
  courses: Course[] = [];

  // ── Course wizard state ───────────────────────────────
  wizardOpen  = false;
  currentStep = 1;
  isLoading   = false;
  errorMsg    = '';
  form = { course_name: '', department: '' as string, year: '' as number | string, doctors: [''] };

  // ── Add doctor popup state ────────────────────────────
  doctorPopupOpen = false;
  isDoctorLoading = false;
  doctorErrorMsg  = '';
  doctorForm = { name: '', course_name: '' };

  constructor(private adminService: AdminPanelService) {}

  // ═════════════════════════════════════════════════════
  // API INTEGRATION POINTS
  // ═════════════════════════════════════════════════════

  ngOnInit() {
    // TODO: call this.adminService.listAllcourses()
    // on next: this.courses = res.courses (map doctors from courseDoctors calls if needed)
    // on error: console.error
  }

  submitCourse() {
    this.isLoading = true; this.errorMsg = '';
    const payload = {
      course_name: this.form.course_name.trim(),
      department:  this.form.department,
      year:        Number(this.form.year),
      doctors:     this.filledDoctors
    };

    // TODO: this.adminService.addCourse(payload.course_name, payload.department, payload.year)
    // on next: (res: any) =>
    //   for each doctor in payload.doctors:
    //     this.adminService.addDoctor(res.course_id, doctor).subscribe()
    //   this.courses.unshift({ ...payload, id: res.course_id })
    //   this.closeWizard()
    // on error: this.errorMsg = err.error?.message
    // finally: this.isLoading = false
    void payload;
    this.isLoading = false;
  }

  deleteCourse(i: number) {
    const course = this.courses[i];
    // TODO: this.adminService.deleteCourse(course.id!)
    // on next: this.courses.splice(i, 1)
    // on error: console.error
    void course;
  }

  submitDoctor() {
    this.doctorErrorMsg = '';
    if (!this.doctorForm.name.trim())  { this.doctorErrorMsg = 'Enter a doctor name.'; return; }
    if (!this.doctorForm.course_name)  { this.doctorErrorMsg = 'Select a course.'; return; }
    this.isDoctorLoading = true;

    const course = this.courses.find(c => c.course_name === this.doctorForm.course_name);
    // TODO: this.adminService.addDoctor(course!.id!, this.doctorForm.name.trim())
    // on next: course!.doctors.push(this.doctorForm.name.trim()); this.closeDoctorPopup()
    // on error: this.doctorErrorMsg = err.error?.message
    // finally: this.isDoctorLoading = false
    void course;
    this.isDoctorLoading = false;
  }

  // ═════════════════════════════════════════════════════
  // UI HELPERS — do not touch
  // ═════════════════════════════════════════════════════

  get wizardTitle()   { return ['Course Details', 'Assign Doctors', 'Review'][this.currentStep - 1]; }
  get filledDoctors() { return this.form.doctors.filter(d => d.trim() !== ''); }
  trackByIndex(index: number) { return index; }

  openWizard() {
    this.wizardOpen = true; this.currentStep = 1; this.errorMsg = '';
    this.form = { course_name: '', department: '', year: '', doctors: [''] };
  }
  closeWizard()     { this.wizardOpen = false; }
  openDoctorPopup() { this.doctorPopupOpen = true; this.doctorErrorMsg = ''; this.doctorForm = { name: '', course_name: '' }; }
  closeDoctorPopup(){ this.doctorPopupOpen = false; }
  addDoctorField()  { this.form.doctors.push(''); }
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