import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { TopnavComponent } from '../uppernav/uppernav.component';
import { StudentService } from '../../services/studentRoute/student-service';

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

  constructor(private studentService: StudentService, private cdr: ChangeDetectorRef){}

  onSubmit(): void {
    // TODO: POST /api/feedback with { message: this.feedbackText }
    // on success → set submitted = true
    this.isLoading = true
    this.studentService.takeFeedback(this.feedbackText).subscribe({
      next: () => {
          this.submitted = true
          this.isLoading = false
          this.cdr.detectChanges();
      }
    })
  }
}