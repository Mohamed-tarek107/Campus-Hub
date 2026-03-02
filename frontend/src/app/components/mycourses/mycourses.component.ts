import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { TopnavComponent } from '../uppernav/uppernav.component';

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
    },
    {
      course_name: 'Database Systems',
      credits: 3,
      doctor_name: 'Dr. Sara Kamel',
      day: 'tuesday',
      timeslot: '10:00-12:00',
      tasks: [
        { title: 'ER Diagram Submission',          deadline: 'Mar 8, 2026',  done: true  },
        { title: 'SQL Lab Report',                 deadline: 'Mar 20, 2026', done: false },
      ]
    },
    {
      course_name: 'Web Development',
      credits: 3,
      doctor_name: 'Dr. Omar Fathy',
      day: 'wednesday',
      timeslot: '12:00-14:00',
      tasks: [
        { title: 'Portfolio Website',              deadline: 'Apr 1, 2026',  done: false },
        { title: 'HTML/CSS Lab',                   deadline: 'Mar 15, 2026', done: true  },
        { title: 'JavaScript Assignment',          deadline: 'Mar 28, 2026', done: false },
        { title: 'Angular Component Task',         deadline: 'Apr 10, 2026', done: false },
      ]
    },
    {
      course_name: 'Operating Systems',
      credits: 3,
      doctor_name: 'Dr. Nour El-Din',
      day: 'thursday',
      timeslot: '14:00-16:00',
      tasks: []  // no tasks yet
    },
    {
      course_name: 'Software Engineering',
      credits: 3,
      doctor_name: 'Dr. Layla Mahmoud',
      day: 'saturday',
      timeslot: '10:00-12:00',
      tasks: [
        { title: 'Requirements Document',          deadline: 'Mar 18, 2026', done: true  },
        { title: 'System Design Diagram',          deadline: 'Apr 5, 2026',  done: false },
      ]
    },
  ];

  ngOnInit(): void {
    // TODO: GET /api/student/courses → replace mock courses + tasks
    // Each course should include its tasks array from the API
    // or: GET /api/student/courses/:course_id/tasks per course when modal opens
  }

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