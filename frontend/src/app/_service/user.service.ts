import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { loginReq, loginresp, userRegister, usercred } from '../_model/user.model';
import { BehaviorSubject, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject: BehaviorSubject<usercred | null> = new BehaviorSubject<usercred | null>(null);
  public user$: Observable<usercred | null> = this.userSubject.asObservable();
  
  private user: usercred | null = null;
  
  constructor(private http: HttpClient) { }

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

  // getUserInfo(userId: number): Observable<usercred> {
  //   return this.http.get<usercred>(`${this.baseUrl}user/${userId}`);
  // }

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
        return error;
      }
    });
  }

}


