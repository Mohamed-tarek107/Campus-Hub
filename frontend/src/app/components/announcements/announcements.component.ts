import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { TopnavComponent } from '../uppernav/uppernav.component';
import { AdminPanelService } from '../../services/admin/admin-panel';

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

  announcements: Announcement[] = [];

  constructor(private listings: AdminPanelService){}
    ngOnInit(): void {
      this.listings.listAllAnnouncements().subscribe({
        next: (res: any) => {
          this.announcements = res.announcements ?? []
        },
    error: (err) => {
      console.error(err);
      }
    });
  }
}