import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user.service';
import {  Observable } from 'rxjs';
import { FileElement } from '../_model/user.model';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private userService: UserService) { }

  uploadFile(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.baseUrl}File/uploadfile`, formData, { headers });
  }

  // GET ALL FILES Entities
  getAllFiles(): Observable<FileElement[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<FileElement[]>(`${this.baseUrl}file/all`, { headers });
  }
  
  //DOWNLOAD FILE 
  downloadFile(entityName: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.baseUrl}File/downloadfile`, {
      headers,
      params: { entityName },
      responseType: 'blob' as 'json'
    });
  }

  //////////////////// RATE AND UNRATE FILE (FORUM) //////////////////
  rateFile(fileId: number): Observable<any> {
    const url = `${this.baseUrl}RateFile/rate/${fileId}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(url, null, {headers} );
  }

  unrateFile(fileId: number): Observable<any> {
    const url = `${this.baseUrl}RateFile/unrate/${fileId}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(url, {headers} );
  }
}
