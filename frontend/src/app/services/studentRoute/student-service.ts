import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/envoriment';
import { HttpClient } from '@angular/common/http';


export interface DoctorSelection {
  course_id: number;
  doctor_name: string;
  day: string;
  timeslot: string;
}

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private readonly studentApi = `${environment.apiUrl}/student`

  constructor(private http: HttpClient){}

  AssignDoctors(selections: DoctorSelection[]){
    this.http.post(`${this.studentApi}/assignDoctors`,
      {selections},
      {withCredentials: true}
    )
  }

  takeFeedback(feedback: string){
    this.http.post(`${this.studentApi}/takeFeedback`,
      {feedback},
      {withCredentials: true}
    )
  }
  
  getStudentCourses(){
    this.http.get(`${this.studentApi}/available`,
      {withCredentials: true}
    )
  }

  getCourseDoctors(){
    
  }

  viewAllstudent_courses(){

  }

  viewAllstudent_doctors(){

  }

  viewAllstudent_tasks(){

  }

}
