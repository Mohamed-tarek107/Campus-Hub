import { Component } from '@angular/core';
import { TopnavComponent } from '../uppernav/uppernav.component';
import { SidenavComponent } from '../sidenav/sidenav.component';

@Component({
  selector: 'app-dashboard',
  imports: [TopnavComponent, SidenavComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {}
