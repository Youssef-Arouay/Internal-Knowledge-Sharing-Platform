import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { loginReq, loginresp, userRegister, usercred } from '../_model/user.model';
import { BehaviorSubject, Observable, Subscription, throwError } from 'rxjs';
import { Router } from '@angular/router';

declare var google : any ;
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject: BehaviorSubject<usercred | null> = new BehaviorSubject<usercred | null>(null);
  public user$: Observable<usercred | null> = this.userSubject.asObservable();

  private user: usercred | null = null;
  private subscriptions: Subscription[] = [];

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) { }

  // for APIs call 
  private createAuthorizationHeader(contentType: string = 'application/json'): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': contentType
    });
  }

  setUser(user: any): void {
    this.user = user;
  }

  getUser(): usercred | null {
    return this.userSubject.value;
  }

  clearUser(): void {
    this.user = null; 
    this.userSubject.next(null); 
    this.clearSubs(); 
  }


  ////// AUTH /////////
  Userregistration(_data: userRegister): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.baseUrl + 'auth/register', _data, { observe: 'response' });
  }

  Proceedlogin(_data: loginReq): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.baseUrl + 'auth/login', _data, { observe: 'response' });
  }

        // login with google api
  LoginGoogle(credentials: string ): Observable<any> {
    const headers = new HttpHeaders().set('Content-type', 'application/json');
    return this.http.post<any>(this.baseUrl + 'auth/loginWithGoogle', JSON.stringify(credentials), { headers });
  }

  //// User Details //////
  getUserInfo(): Observable<usercred> {
    const headers = this.createAuthorizationHeader();
    return this.http.get<usercred>(`${this.baseUrl}user/GetUserDetails`, { headers });
  }

  fetchUserInfo(): void {
    const headers = this.createAuthorizationHeader();
    this.http.get<usercred>(`${this.baseUrl}user/GetUserDetails`, { headers }).subscribe({
      next: (user: usercred) => {
        this.userSubject.next(user);
        this.setUser(user);
      },
      error: (error) => {
        console.error('Failed to fetch user info', error);
        this.userSubject.next(null);
        this.logout();
        return error;
      }
    });
  }

  updateProfile(formData: FormData): Observable<any> {
    // const headers = this.createAuthorizationHeader();
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(`${this.baseUrl}user/UpdateUser`, formData, { headers });
  }


  // LOGOUT : Clear Local Storage, Cookies and Entity User
  logout() {
    this.clearUser();
    //localStorage.clear;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    //this.clearCookies();

    google.accounts.id.disableAutoSelect();
    
    setTimeout(() => {
      this.router.navigateByUrl('/register');
    }, 200);
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

  clearSubs(): void {
    // Unsubscribe from all subscriptions to avoid memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}


