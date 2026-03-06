import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AdminSidenavComponent } from '../admin.sidenav/admin.sidenav.component';
import { AdminTopnavComponent } from '../admin.topnav/admin.topnav.component';

interface Feedback {
  username: string;
  message:  string;
  date:     string;
}

@Component({
  selector: 'app-feedbacks.component',
  imports: [CommonModule, AdminSidenavComponent, AdminTopnavComponent],
  templateUrl: './feedbacks.component.html',
  styleUrl: './feedbacks.component.css',
})
export class AdminFeedbacksComponent {
      // TODO: replace with GET /api/admin/feedback
  feedbacks: Feedback[] = [
    { username: 'Ahmed Youssef',  message: 'The GPA calculator is really helpful, would love to see a semester history feature.', date: 'Mar 3, 2026' },
    { username: 'Sara El-Sayed',  message: 'Announcement emails are great but they arrive a bit late sometimes.', date: 'Mar 2, 2026' },
    { username: 'Omar Khaled',    message: 'The assign doctors page was a bit confusing at first but works well once you get it.', date: 'Feb 28, 2026' },
    { username: 'Nour Hassan',    message: 'Would be nice to have a dark mode toggle but overall the design looks good.', date: 'Feb 25, 2026' },
  ];

  ngOnInit(): void {
    // TODO: GET /api/admin/feedback → replace mock feedbacks array
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
}
