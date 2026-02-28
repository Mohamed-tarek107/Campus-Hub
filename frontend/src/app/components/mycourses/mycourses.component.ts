import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { TopnavComponent } from '../uppernav/uppernav.component';

interface Course {
  course_name: string;
  credits: number;
  doctor_name: string;
  day: string;
  timeslot: string;
}

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [CommonModule, RouterModule, SidenavComponent, TopnavComponent],
  templateUrl: './mycourses.component.html',
  styleUrls: ['./mycourses.component.css']
})
export class MyCoursesComponent implements OnInit {

  // ── Card accent colors — one per card cycling ─────────
  accentColors = [
    '#2563eb',   // blue
    '#7c3aed',   // purple
    '#0891b2',   // cyan
    '#059669',   // emerald
    '#d97706',   // amber
  ];

  // ── Mock data — replace with GET /api/student/courses ──
  courses: Course[] = [
    {
      course_name: 'marketing',
      credits: 3,
      doctor_name: 'Dr. mostafa yousef',
      day: 'monday',
      timeslot: '08:00-10:00'
    },
    {
      course_name: 'Creative Thinking',
      credits: 3,
      doctor_name: 'Dr. el tayar',
      day: 'tuesday',
      timeslot: '10:00-12:00'
    },
    {
      course_name: 'Acc Corporation',
      credits: 3,
      doctor_name: 'Dr. Elardy',
      day: 'wednesday',
      timeslot: '12:00-14:00'
    },
    {
      course_name: 'System Analysis and design',
      credits: 3,
      doctor_name: 'Dr. amira mohy',
      day: 'thursday',
      timeslot: '14:00-16:00'
    },
    {
      course_name: 'M&B',
      credits: 3,
      doctor_name: 'Dr. AbdelGawad',
      day: 'sunday',
      timeslot: '8:00-10:00'
    },
  ];

  ngOnInit(): void {
    // TODO: GET /api/student/courses → replace mock with real data
  }
}