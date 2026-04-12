import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { StudentService } from '../../services/studentRoute/student-service';

interface Selection {
  course_id: number;
  course_name: string;
  doctor_name: string;
  day: string;
  timeslot: string;
  doctors: { id: string; name: string }[];
}

@Component({
  selector: 'app-assign-doctors',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './assigndoctors.component.html',
  styleUrls: ['./assigndoctors.component.css']
})
export class AssignDoctorsComponent implements OnInit {

  validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'saturday', 'sunday'];
  validTimeSlots = ['08:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00', '16:00-18:00', '18:00-20:00'];

  selections: Selection[] = [];
  isLoading = false;
  errorMessage = '';
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

  constructor(private router: Router, private studentService: StudentService) { }

  ngOnInit(): void {

    this.studentService.viewAllstudent_courses().subscribe({
      next: (res: any) => {
        const enrolled = res.courses ?? []


        if (enrolled.length > 0) {
          this.isEditMode = true;
          this.selections = enrolled.map((c: any) => ({
            course_id: c.course_id,
            course_name: c.course_name,
            doctor_name: c.doctor_name,
            day: c.day,
            timeslot: c.timeslot,
            doctors: []
          }));
          this.loadDoctorsForSelections();
        } else {
          // FIRST TIME MODE — empty selections, student picks everything fresh
          this.isEditMode = false;
          this.studentService.getStudentCourses().subscribe({
            next: (available: any) => {
              this.selections = (available.courses ?? []).map((c: any) => ({
                course_id: c.id,
                course_name: c.course_name,
                doctor_name: '',
                day: '',
                timeslot: '',
                doctors: []
              }))
              this.loadDoctorsForSelections();
            }
          });
        }
      }
    });

  }


  private loadDoctorsForSelections(): void {
    this.selections.forEach((sel, i) => {
      this.studentService.getCourseDoctors(sel.course_id).subscribe({
        next: (res: any) => {
          this.selections[i].doctors = (res.doctors ?? []).map((d: any) => ({
            id: d.doctor_id,
            name: d.name
          }));
        },
        error: () => {
          this.selections[i].doctors = [];
        }
      });
    });
  }



  isRowComplete(index: number): boolean {
    const sel = this.selections[index];
    return !!(sel.doctor_name && sel.day && sel.timeslot);
  }

  onFieldChange(): void { }

  onSubmit(): void {
    if (!this.allComplete) { this.errorMessage = 'Please complete all rows.'; return; }
    this.isLoading = true;
    this.errorMessage = '';

    const body = {
      selections: this.selections.map(s => ({
        course_id: s.course_id,
        doctor_name: s.doctor_name,
        day: s.day,
        timeslot: s.timeslot
      }))
    };

    this.studentService.AssignDoctors(body).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message ?? 'Something went wrong.';
      }
    })
  }
}