import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { loginReq, loginresp, userRegister, usercred } from '../_model/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  baseUrl = environment.apiUrl;

  Userregistration(_data: userRegister) : Observable<HttpResponse<any>>{
    return this.http.post<any>(this.baseUrl + 'auth/register', _data,{observe:'response'});
  }

  Proceedlogin(_data: loginReq) : Observable<HttpResponse<any>> {
    return this.http.post<any>(this.baseUrl + 'auth/login', _data,{observe:'response'});
  }

}

export interface menu {
    code: string;
    name: string;
}

