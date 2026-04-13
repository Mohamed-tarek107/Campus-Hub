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

  AssignDoctors(body: { selections: DoctorSelection[] }){
    return this.http.post(`${this.studentApi}/assignDoctors`, body)
  }

  takeFeedback(feedback: string){
    return this.http.post(`${this.studentApi}/takeFeedback`,
      {feedback},
    )
  }
  
  getStudentCourses(){
    return this.http.get(`${this.studentApi}/available`,
    )
  }

  getCourseDoctors(id: number){
    return this.http.get(`${this.studentApi}/${id}/doctors`,
    )
  }

  viewAllstudent_courses(){
    return this.http.get(`${this.studentApi}/viewAllStudentCourses`,
    )
  }

  viewAllstudent_doctors(){
    return this.http.get(`${this.studentApi}/viewAllStudentdoctors`,
    )
  }

  viewDoneTasks(){
    return this.http.get(`${this.studentApi}/viewDoneTasks`,)
  }
  
  markTaskDone(task_id: number){
    return this.http.post(`${this.studentApi}/markTaskDone/${task_id}`,{})
  }

  viewAllstudent_tasks(){
    return this.http.get(`${this.studentApi}/viewAllStudenttasks`,
    )
  }


  viewCourse_tasks(coursedoctor_id: number){
    return this.http.get(`${this.studentApi}/viewCourseTasks/${coursedoctor_id}`)
  }
}
