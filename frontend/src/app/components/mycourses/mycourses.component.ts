import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { TopnavComponent } from '../uppernav/uppernav.component';
import { StudentService } from '../../services/studentRoute/student-service';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';

interface Task {
  task_id:  number;
  title:    string;
  type:     string;
  deadline: string;
  status:   'pending' | 'done';
}

interface Course {
  course_id:       number;
  coursedoctor_id: number;
  credit:          number; 
  course_name:     string;
  department:      string;
  year:            number;
  doctor_name:     string;
  day:             string;
  timeslot:        string;
  tasks:           Task[];
}

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [CommonModule, RouterModule, SidenavComponent, TopnavComponent],
  templateUrl: './mycourses.component.html',
  styleUrls: ['./mycourses.component.css']
})
export class MyCoursesComponent implements OnInit {

  accentColors = ['#2563eb', '#7c3aed', '#0891b2', '#059669', '#d97706'];

  selectedCourse: Course | null = null;

  // TODO: replace with GET /api/student/courses (each course includes its tasks)
  courses: Course[] = [];

  constructor(private studentService: StudentService, private cdr: ChangeDetectorRef){}

  ngOnInit(): void {  
    this.loadCoursesAndTasks();
  }

  loadCoursesAndTasks(){
    this.studentService.viewAllstudent_courses().pipe(
      switchMap((data: any) => {
        const baseCourses: Course[] = (data.courses ?? []).map((c: any) => ({ ...c, tasks: [] }));
        
        if (baseCourses.length === 0) return of(baseCourses);
        
        return forkJoin(
          baseCourses.map((course: Course) =>
            this.studentService.viewCourse_tasks(course.course_id).pipe(
              map((res: any) => ({
                ...course,
                tasks: (res.tasks ?? []).map((t: any) => ({
                  task_id:  t.task_id,
                  title:    t.title,
                  type:     t.type,
                  deadline: t.deadline,
                  status:   t.status
                }))
              })),
              catchError(() => of({...course, tasks: []}))
            )
          )
        );
      })
    ).subscribe({
        next: (courses: any) => {
          this.courses = courses
          this.cdr.detectChanges()
        }
      }
    );
  }


  markDone(task_id: number){
    this.studentService.markTaskDone(task_id).subscribe({
      next: () => {
        
      }
    })
  }

  openTasks(course: Course): void {}

  closeTasks(): void {
    this.selectedCourse = null;
  }

  // Returns true if deadline has passed
  isOverdue(deadline: string): boolean {
    return new Date(deadline) < new Date();
  }
}