import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { TopnavComponent } from '../uppernav/uppernav.component';

interface Event {
  title: string;
  description: string;
  date: string;
  location: string;
  host: string;
}

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, RouterModule, SidenavComponent, TopnavComponent],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  // TODO: replace with GET /api/events via EventsService
  events: Event[] = [
    {
      title: 'Tech Career Fair 2026',
      description: 'Meet recruiters from top tech companies. Bring your CV and be ready for on-spot interviews.',
      date: 'March 10, 2026',
      location: 'Main Hall, Building A',
      host: 'Career Center'
    },
    {
      title: 'AI & Machine Learning Workshop',
      description: 'A hands-on workshop covering the fundamentals of machine learning and practical AI applications.',
      date: 'March 14, 2026',
      location: 'Lab 204, Building B',
      host: 'BIS Department'
    },
    {
      title: 'End of Semester Cultural Day',
      description: 'Annual cultural celebration featuring student performances, food stalls, and activities from across the university.',
      date: 'March 28, 2026',
      location: 'University Courtyard',
      host: 'Student Union'
    },
    {
      title: 'Database Design Seminar',
      description: 'A seminar by industry professionals covering modern database architecture and real-world case studies.',
      date: 'April 3, 2026',
      location: 'Lecture Hall 1',
      host: 'FMI Department'
    },
  ];

  ngOnInit(): void {
    // TODO: inject EventsService and call getAll()
    // this.eventsService.getAll().subscribe(data => this.events = data);
  }
}