import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AdminSidenavComponent } from '../admin.sidenav/admin.sidenav.component';
import { AdminTopnavComponent } from '../admin.topnav/admin.topnav.component';
import { AdminPanelService } from '../../../services/admin/admin-panel';

interface Feedback {
  id: number;
  username: string;
  message: string;
  date: string;
}

@Component({
  selector: 'app-feedbacks.component',
  standalone: true,
  imports: [CommonModule, AdminSidenavComponent, AdminTopnavComponent],
  templateUrl: './feedbacks.component.html',
  styleUrl: './feedbacks.component.css',
})
export class AdminFeedbacksComponent implements OnInit {
  feedbacks: Feedback[] = []


  constructor(private adminService: AdminPanelService, private cdr: ChangeDetectorRef){}
  ngOnInit(): void {
    this.listFeedbacks();
  }


  listFeedbacks(){
    this.adminService.listAllFeedbacks().subscribe({
      next: (data: any) => {
        this.feedbacks = (data.feedbacks ?? []).map((f: any) => {
          return {
            id: f.id,
            username: f.username,
            message: f.feedback,
            date: f.created_at,
          };
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err.message ? err.message : err);
      }
    });
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
