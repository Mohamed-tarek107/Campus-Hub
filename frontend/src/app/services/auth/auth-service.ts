import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/envoriment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly authApi = `${environment.apiUrl}/auth`
    isLoggedin = false

    constructor(private http: HttpClient) { }


    register(
        username: string,
        email: string,
        password: string,
        confirmpassword: string,
        department: string,
        year: number
    ) {
        return this.http.post(
            `${this.authApi}/register`,
            {
                username,
                email,
                password,
                confirmpassword,
                department,
                year
            },
            { withCredentials: true }
        )
    }


    login(username: string, password: string): Observable<any> {
        return this.http.post(
            `${this.authApi}/login`,
            { username, password },
            { withCredentials: true }
        ).pipe(
            tap(() => {
                this.isLoggedin = true; // set flag on successful login
            })
        );
    }

    refreshtoken() {
        return this.http.post(
            `${this.authApi}/refresh-token`,
            {},
            { withCredentials: true }
        );
    }


    logout() {
        return this.http.post(
            `${this.authApi}/logout`,
            {},
            { withCredentials: true }
        ).pipe(
                tap(() => {
                    this.isLoggedin = false; // reset flag on logout
                })
            );
    }
}
