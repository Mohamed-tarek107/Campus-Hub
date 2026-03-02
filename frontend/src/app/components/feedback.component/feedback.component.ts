import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { TopnavComponent } from '../uppernav/uppernav.component';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule, SidenavComponent, TopnavComponent],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent {
  feedbackText = '';
  isLoading = false;
  submitted = false;

  onSubmit(): void {
    // TODO: POST /api/feedback with { message: this.feedbackText }
    // on success → set submitted = true
  }
}