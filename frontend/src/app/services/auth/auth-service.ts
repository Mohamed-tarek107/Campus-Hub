import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/envoriment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
    private readonly authApi = `${environment.apiUrl}/auth`
    isLoggedin = false

    constructor(private http: HttpClient){}


    register(
        username: string, 
        email: string,
        password: string,
        confirmpassword: string,
        department: string,
        year: number
    ){
        return this.http.post(`${this.authApi}/register`, {
            username,
            email,
            password, 
            confirmpassword,
            department,
            year
        })
    }
    
    


}
