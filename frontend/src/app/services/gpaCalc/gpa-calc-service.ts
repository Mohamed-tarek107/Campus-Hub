import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/envoriment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class GpaCalcService {
  private readonly gpaApi = `${environment.apiUrl}/gpa`

  constructor(private http: HttpClient){}

  editUserGpa(gpa: Number){
    return this.http.post(`${this.gpaApi}/assginGpa`,
      { gpa },
      {withCredentials: true})
  }

  chatBot(msg: string, history: []){
    return this.http.post(`${this.gpaApi}/aiChat`,
    { msg, history },
    { withCredentials: true })
  }
}
