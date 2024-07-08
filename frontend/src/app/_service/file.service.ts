import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user.service';
import { catchError, Observable, throwError } from 'rxjs';
import { FileElement, fileForm } from '../_model/user.model';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private userService: UserService) { }


  // uploadFile(formData: FormData): Observable<any> {
  //   const token = localStorage.getItem('token');
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${token}`
  //   });
  //   return this.http.post<any>(`${this.baseUrl}File/uploadfile`, formData, { headers });
  // }

  // uploadFile(fileForm: fileForm): Observable<any> {
  //   const token = localStorage.getItem('token');
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${token}`
  //   });
  //   console.log('Sending fileForm to the server:', fileForm);
  //   return this.http.post<any>(`${this.baseUrl}file/uploadfile`, fileForm, { headers });
  // }

  uploadFile(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.baseUrl}File/uploadfile`, formData, { headers });
  }

  // GET ALL FILES
  getAllFiles(): Observable<FileElement[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<FileElement[]>(`${this.baseUrl}file/all`, { headers });
  }
  
}
