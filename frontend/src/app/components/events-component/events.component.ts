import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { TopnavComponent } from '../uppernav/uppernav.component';
import { StudentService } from '../../services/studentRoute/student-service';
import { AdminPanelService } from '../../services/admin/admin-panel';

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
  events: Event[] = [];

  constructor(private listings: AdminPanelService){}
  ngOnInit(): void {
    this.listings.listAllEvents().subscribe({
      next: (res: any) => {
        this.events = res.events ?? []
      },
    error: (err) => {
        console.error(err);
      }
    });
  }
}
