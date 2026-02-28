import { Routes } from '@angular/router';
import { LoginPage } from './components/login-page/login-page';
import { RegisterPage } from './components/register-page/register-page';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AssigndoctorsComponent } from './components/assigndoctors/assigndoctors.component';
import { GpaCalculatorComponent } from './components/gpa-calculator.component/gpa-calculator.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full'},
    { path: 'login', component: LoginPage },
    { path: 'register', component: RegisterPage },
    { path: 'dashboard', component: DashboardComponent},
    { path: 'assignDoctors', component: AssigndoctorsComponent},
    { path: 'gpaCalculator', component: GpaCalculatorComponent}
];
