import { Routes } from '@angular/router';
import { LoginPage } from './components/login-page/login-page';
import { RegisterPage } from './components/register-page/register-page';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AssignDoctorsComponent } from './components/assigndoctors/assigndoctors.component';
import { GpaCalculatorComponent } from './components/gpa-calculator.component/gpa-calculator.component';
import { MyCoursesComponent } from './components/mycourses/mycourses.component';
import { AnnouncementsComponent } from './components/announcements/announcements.component';
import { EventsComponent } from './components/events-component/events.component';
import { FeedbackComponent } from './components/feedback.component/feedback.component';
import { SettingsComponent } from './components/settings.component/settings.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { AdminDashboardComponent } from './components/Admin/admin.dashboard/admin.dashboard.component';
import { AdminFeedbacksComponent } from './components/Admin/admin.feedbacks/feedbacks.component';
import { AdminAcademicsComponent } from './components/Admin/admin.academics/admin.academics.component';
import { AdminPublishComponent } from './components/Admin/admin.publish/admin.publish.component';

export const routes: Routes = [
    //starter route
    { path: '', redirectTo: 'login', pathMatch: 'full'},

    //user routes
    { path: 'login', component: LoginPage },
    { path: 'register', component: RegisterPage },
    { path: 'dashboard', component: DashboardComponent},
    { path: 'assignDoctors', component: AssignDoctorsComponent},
    { path: 'gpaCalculator', component: GpaCalculatorComponent},
    { path: 'myCourses', component: MyCoursesComponent},
    { path: 'announcements', component: AnnouncementsComponent},
    { path: 'events', component: EventsComponent},
    { path: 'feedback', component: FeedbackComponent},
    { path: 'settings', component: SettingsComponent},
    
    //Admin Routes
    { path: 'admin/dashboard', component: AdminDashboardComponent },
    { path: 'admin/feedbacks', component: AdminFeedbacksComponent},
    { path: 'admin/publish', component: AdminPublishComponent},
    { path: 'admin/academics', component: AdminAcademicsComponent},



    // Not found route
    { path: '**', component: NotFoundPageComponent}
];
