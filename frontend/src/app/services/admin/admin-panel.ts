import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/envoriment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AdminPanelService {
  private readonly AdminApi = `${environment.apiUrl}/admin`

  constructor(private http: HttpClient){}

  AssignDoctors(){

  }


  getStudentCourses(){

  }


  getCourseDoctors(){

  }


  viewAllstudent_courses(){

  }


  viewAllstudent_doctors(){

  }


  viewAllstudent_tasks(){

  }


  takeFeedback(){
    
  }
  


}
