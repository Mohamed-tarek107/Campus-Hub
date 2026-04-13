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
      return this.http.get(`${this.userApi}/userInfo`)
    }
    editInfo(email: string, username: string, year: number, bio: string){
      return this.http.patch(`${this.userApi}/editInfo`,
        { email, username, year, bio })
    }

    changepass(currentpass: string, newpass: string, confirmpass: string){
      return this.http.patch(`${this.userApi}/changePassword`,
        { currentpass, newpass, confirmpass })
    }
    deleteAccount(){
      return this.http.delete(`${this.userApi}/deleteAccount`)
    }
}
