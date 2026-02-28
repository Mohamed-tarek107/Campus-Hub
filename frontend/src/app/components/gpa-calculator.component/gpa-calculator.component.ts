import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { TopnavComponent } from '../uppernav/uppernav.component';

interface Course {
  course_name: string;
  credits: number;
  selectedGrade: string;
}

@Component({
  selector: 'app-gpa-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DecimalPipe, SidenavComponent, TopnavComponent],
  templateUrl: './gpa-calculator.component.html',
  styleUrls: ['./gpa-calculator.component.css']
})
export class GpaCalculatorComponent implements OnInit {

  // ── Data ──────────────────────────────────────────────
  currentGpa: number = 0;    // TODO: GET /api/student/gpa

  // Static 6 courses until services are configured
  // TODO: replace with GET /api/student/courses
  courses: Course[] = [
    { course_name: 'Mathematics', credits: 3, selectedGrade: '' },
    { course_name: 'Data Structures', credits: 3, selectedGrade: '' },
    { course_name: 'Web Development', credits: 3, selectedGrade: '' },
    { course_name: 'Database Systems', credits: 3, selectedGrade: '' },
    { course_name: 'Operating Systems', credits: 3, selectedGrade: '' },
    { course_name: 'Software Engineering', credits: 3, selectedGrade: '' },
  ];

  // ── Grade scale ───────────────────────────────────────
  gradeOptions = [
    { label: 'A+', value: 4.00 },
    { label: 'A',  value: 3.50 },
    { label: 'B+', value: 3.30 },
    { label: 'B',  value: 3.00 },
    { label: 'C+', value: 2.50 },
    { label: 'C',  value: 2.00 },
    { label: 'D',  value: 1.70 },
    { label: 'F',  value: 0.00 },
  ];

  // ── State ─────────────────────────────────────────────
  projectedGpa: number | null = null;

  // ── Computed ──────────────────────────────────────────
  get gpaDiff(): number {
    if (this.projectedGpa === null) return 0;
    return parseFloat((this.projectedGpa - this.currentGpa).toFixed(2));
  }

  get gpaLabel(): string {
    return this.getGpaLabel(this.currentGpa);
  }

  get gpaClass(): string {
    return this.getGpaClass(this.currentGpa);
  }

  get projectedGpaLabel(): string {
    return this.projectedGpa !== null ? this.getGpaLabel(this.projectedGpa) : '';
  }

  get projectedGpaClass(): string {
    return this.projectedGpa !== null ? this.getGpaClass(this.projectedGpa) : '';
  }

  // ── Lifecycle ─────────────────────────────────────────
  ngOnInit(): void {
    // TODO: GET /api/student/gpa → set currentGpa
    // TODO: GET /api/student/courses → replace static courses array
  }

  // ── Methods ───────────────────────────────────────────

  // Returns the grade points for a selected grade value
  getGradePoints(value: string): number {
    return parseFloat(value);
  }

  // Called whenever a grade dropdown changes
  onGradeChange(): void {
    const graded = this.courses.filter(c => c.selectedGrade !== '');
    if (graded.length === 0) {
      this.projectedGpa = null;
      return;
    }
    const totalPoints = graded.reduce((sum, c) => sum + (c.credits * parseFloat(c.selectedGrade)), 0);
    const totalCredits = graded.reduce((sum, c) => sum + c.credits, 0);
    this.projectedGpa = parseFloat((totalPoints / totalCredits).toFixed(2));
  }

  // Resets all grade selections
  resetGrades(): void {
    this.courses.forEach(c => c.selectedGrade = '');
    this.projectedGpa = null;
  }

  // ── Helpers ───────────────────────────────────────────
  private getGpaLabel(gpa: number): string {
    if (gpa >= 3.5) return 'Excellent';
    if (gpa >= 3.0) return 'Very Good';
    if (gpa >= 2.5) return 'Good';
    if (gpa >= 2.0) return 'Pass';
    return 'Fail';
  }

  private getGpaClass(gpa: number): string {
    if (gpa >= 3.5) return 'gpa-excellent';
    if (gpa >= 3.0) return 'gpa-very-good';
    if (gpa >= 2.5) return 'gpa-good';
    if (gpa >= 2.0) return 'gpa-pass';
    return 'gpa-fail';
  }
}