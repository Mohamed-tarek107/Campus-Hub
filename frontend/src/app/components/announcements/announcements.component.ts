import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { TopnavComponent } from '../uppernav/uppernav.component';

interface Announcement {
  title: string;
  description: string;
  source: string;
  date: string;
}

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [CommonModule, RouterModule, SidenavComponent, TopnavComponent],
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.css']
})
export class AnnouncementsComponent implements OnInit {

  // TODO: replace with GET /api/announcements via AnnouncementsService
  announcements: Announcement[] = [
    {
      title: 'Mid-Term Exam Schedule Released',
      description: 'The mid-term examination schedule for all BIS and FMI courses has been published. Please check the academic portal for your specific exam times and rooms. Students must bring their university ID.',
      source: 'Academic Affairs',
      date: 'March 1, 2026'
    },
    {
      title: 'Registration for Next Semester Now Open',
      description: 'Students can now register for next semester courses through the student portal. Registration closes on March 20th. Make sure to consult your academic advisor before finalizing your schedule.',
      source: 'Registrar',
      date: 'February 26, 2026'
    },
    {
      title: 'Campus Library Extended Hours',
      description: 'The main campus library will be open until midnight during the exam period starting from March 10th through March 31st. Study rooms can be booked online up to 48 hours in advance.',
      source: 'Library',
      date: 'February 22, 2026'
    },
    {
      title: 'Graduation Application Deadline',
      description: 'Final year students who intend to graduate this semester must submit their graduation applications by March 15th. Late applications will not be accepted. Visit the registrar office for more details.',
      source: 'Registrar',
      date: 'February 18, 2026'
    },
  ];

  ngOnInit(): void {
    // TODO: inject AnnouncementsService and call getAll()
    // this.announcementsService.getAll().subscribe(data => this.announcements = data);
  }
}