import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/envoriment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
    private readonly userApi = `${environment.apiUrl}/user`

    constructor(private http: HttpClient){}

    userInfo(){

    }
    editInfo(){

    }
    changepass(){

    }
    deleteAccount(){
      
    }
}
