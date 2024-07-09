import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { loginReq, loginresp, userRegister, usercred } from '../_model/user.model';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  getToken() {
    throw new Error('Method not implemented.');
  }
  private userSubject: BehaviorSubject<usercred | null> = new BehaviorSubject<usercred | null>(null);
  public user$: Observable<usercred | null> = this.userSubject.asObservable();
  
  private user: usercred | null = null;
  
  constructor(private http: HttpClient, private router : Router) { }

  setUser(user: any): void {
    this.user = user;
  }

  getUser(): usercred | null {
    return this.userSubject.value;
  }

  updateUser(user: usercred | null) {
    this.userSubject.next(user);
  }

  clearUser(): void {
    this.user = null;
  }

  baseUrl = environment.apiUrl;

  Userregistration(_data: userRegister) : Observable<HttpResponse<any>>{
    return this.http.post<any>(this.baseUrl + 'auth/register', _data,{observe:'response'});
  }

  Proceedlogin(_data: loginReq) : Observable<HttpResponse<any>> {
    return this.http.post<any>(this.baseUrl + 'auth/login', _data,{observe:'response'});
  }

  getUserInfo(): Observable<usercred> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<usercred>(`${this.baseUrl}user/GetUserDetails`, { headers });
  }

  fetchUserInfo(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    this.http.get<usercred>(`${this.baseUrl}user/GetUserDetails`, { headers }).subscribe({
      next: (user: usercred) => {
        this.userSubject.next(user);
      },
      error: (error) => {
        console.error('Failed to fetch user info', error);
        this.userSubject.next(null);
        this.logout();
        return error;
      }
    });
  }

  // LOGOUT : Clear Local Storage, Cookies and Entity User
  logout() {
    this.clearUser(); 
    // Clear user information from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    localStorage.clear;
    // Optionally clear cookies if needed
    this.clearCookies();
    console.log("Logged out successfully")
    
    // Navigate to the login or register page
    setTimeout(() => {
      this.router.navigateByUrl('/register');
    }, 200);
    // Show a logout success message
  }

  clearCookies(): void {
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    }
  }

}


