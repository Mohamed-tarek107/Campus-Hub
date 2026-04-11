import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { TopnavComponent } from '../uppernav/uppernav.component';
import { StudentService } from '../../services/studentRoute/student-service';
import { of, switchMap } from 'rxjs';

interface Task {
  title:    string;
  deadline: string;
  done:     boolean;
}

interface Course {
  course_name: string;
  credits:     number;
  doctor_name: string;
  day:         string;
  timeslot:    string;
  tasks:       Task[];
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
  courses: Course[] = [
    {
      course_name: 'Data Structures & Algorithms',
      credits: 3,
      doctor_name: 'Dr. Ahmed Hassan',
      day: 'monday',
      timeslot: '08:00-10:00',
      tasks: [
        { title: 'Assignment 1 — Linked Lists',    deadline: 'Mar 10, 2026', done: true  },
        { title: 'Assignment 2 — Binary Trees',    deadline: 'Mar 24, 2026', done: false },
        { title: 'Quiz — Sorting Algorithms',      deadline: 'Apr 2, 2026',  done: false },
      ]
    }
  ];

  constructor(private studentService: StudentService){}

  ngOnInit(): void {
    // TODO: GET /api/student/courses → replace mock courses + tasks
    // Each course should include its tasks array from the API
    // or: GET /api/student/courses/:course_id/tasks per course when modal opens
  }

  // loadCourses_Tasks(){
  //   this.studentService.viewAllstudent_courses().pipe(
  //     switchMap((data: any) => {
  //       const baseCourses: Course[] = (data.courses ?? []).map((c: any) => ({ ...c, tasks: [] }));


  //       if (baseCourses.length === 0) return of(baseCourses);
        
  //     })
  //   )
  // }



  openTasks(course: Course): void {
    this.selectedCourse = course;
    // TODO when service ready:
    // if tasks aren't loaded yet, fetch here:
    // this.tasksService.getByCourse(course.course_id).subscribe(tasks => {
    //   this.selectedCourse!.tasks = tasks;
    // });
  }

  closeTasks(): void {
    this.selectedCourse = null;
  }

  // Returns true if deadline has passed
  isOverdue(deadline: string): boolean {
    return new Date(deadline) < new Date();
  }
}