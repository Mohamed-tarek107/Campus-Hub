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
    return this.http.post(`${this.studentApi}/assignDoctors`,
      {selections},
      {withCredentials: true}
    )
  }

  takeFeedback(feedback: string){
    return this.http.post(`${this.studentApi}/takeFeedback`,
      {feedback},
      {withCredentials: true}
    )
  }
  
  getStudentCourses(){
    return this.http.get(`${this.studentApi}/available`,
      {withCredentials: true}
    )
  }

  getCourseDoctors(id: number){
    return this.http.get(`${this.studentApi}/${id}/doctors`,
      {withCredentials: true}
    )
  }

  viewAllstudent_courses(){
    return this.http.get(`${this.studentApi}/viewAllStudentCourses`,
      {withCredentials: true}
    )
  }

  viewAllstudent_doctors(){
    return this.http.get(`${this.studentApi}/viewAllStudentdoctors`,
      {withCredentials: true}
    )
  }

  viewDoneTasks(){
    return this.http.get(`${this.studentApi}/viewDoneTasks`,
      {withCredentials: true}
    )
  }
  
  markTaskDone(task_id: number){
    return this.http.get(`${this.studentApi}/markTaskDone/${task_id}`,
      {withCredentials: true}
    )
  }

}
