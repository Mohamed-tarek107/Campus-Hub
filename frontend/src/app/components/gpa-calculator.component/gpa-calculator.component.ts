import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { TopnavComponent } from '../uppernav/uppernav.component';
import { GpaAdvisorComponent } from '../gpa-advisor/gpa-advisor.component';
import { UserProfileService } from '../../services/userProfile/user-profile-service';
import { StudentService } from '../../services/studentRoute/student-service';

interface Course {
  course_name: string;
  credits: number;
  selectedGrade: string;
}

@Component({
  selector: 'app-gpa-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DecimalPipe, SidenavComponent, TopnavComponent, GpaAdvisorComponent],
  templateUrl: './gpa-calculator.component.html',
  styleUrls: ['./gpa-calculator.component.css']
})
export class GpaCalculatorComponent implements OnInit {

  
  currentGpa: number = 0;    
  courses: Course[] = [];

  // A+  90% and above        → 4.00
  // A   85% to less than 90% → 3.75
  // B+  80% to less than 85% → 3.40
  // B   75% to less than 80% → 3.10
  // C+  70% to less than 75% → 2.80
  // C   65% to less than 70% → 2.50
  // D+  60% to less than 65% → 2.25
  // D   50% to less than 60% → 2.00
  // F   less than 50%        → 0.00
  gradeOptions = [
    { label: 'A+', value: 4.00 },
    { label: 'A',  value: 3.75 },
    { label: 'B+', value: 3.40 },
    { label: 'B',  value: 3.10 },
    { label: 'C+', value: 2.80 },
    { label: 'C',  value: 2.50 },
    { label: 'D+', value: 2.25 },
    { label: 'D',  value: 2.00 },
    { label: 'F',  value: 0.00 },
  ];

  projectedGpa: number | null = null;

  
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


  constructor(private userService: UserProfileService, private studentService: StudentService, private cdr: ChangeDetectorRef){}
  
  ngOnInit(): void {
    // TODO: GET /api/student/gpa → set currentGpa
    this.userService.userInfo().subscribe({
      next: (data: any) => {
        const user = Array.isArray(data.user) ? data.user[0] : data.user;
        this.currentGpa = Number(user?.gpa ?? 0);
        this.cdr.detectChanges();
      }
    })
    // TODO: GET /api/student/courses → replace static courses array
    this.studentService.viewAllstudent_courses().subscribe({
      next: (courses: any) => {
        this.courses = (courses.courses ?? []).map((c: any) => ({
          course_name: c.course_name,
          credits: Number(c.credit ?? 0),
          selectedGrade: ''
        }));
        this.cdr.detectChanges();
      }
    })
  }


  getGradePoints(value: string): number {
    return parseFloat(value);
  }

  onGradeChange(): void {
    const graded = this.courses.filter(c => c.selectedGrade !== '');
    if (graded.length === 0) {
      this.projectedGpa = null;
      return;
    }
    const totalPoints  = graded.reduce((sum, c) => sum + (c.credits * parseFloat(c.selectedGrade)), 0);
    const totalCredits = graded.reduce((sum, c) => sum + c.credits, 0);
    this.projectedGpa  = parseFloat((totalPoints / totalCredits).toFixed(2));
  }

  resetGrades(): void {
    this.courses.forEach(c => c.selectedGrade = '');
    this.projectedGpa = null;
  }

  // ── Helpers ───────────────────────────────────────────
  private getGpaLabel(gpa: number): string {
    if (gpa >= 3.75) return 'Excellent';
    if (gpa >= 3.10) return 'Very Good';
    if (gpa >= 2.80) return 'Good';
    if (gpa >= 2.00) return 'Pass';
    return 'Fail';
  }

  private getGpaClass(gpa: number): string {
    if (gpa >= 3.75) return 'gpa-excellent';
    if (gpa >= 3.10) return 'gpa-very-good';
    if (gpa >= 2.80) return 'gpa-good';
    if (gpa >= 2.00) return 'gpa-pass';
    return 'gpa-fail';
  }
}