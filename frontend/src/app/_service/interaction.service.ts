import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { postCommentReq } from '../_model/user.model';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  likePost(postId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.baseUrl}post/like/${postId}`, {}, { headers });
  }

  unlikePost(postId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.delete<any>(`${this.baseUrl}post/unlike/${postId}`, { headers });
  }
  

  // Method to add a comment
  addComment(comment: postCommentReq): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${this.baseUrl}post/comment/add`, comment, { headers });
  }

  deleteComment(commentId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<any>(`${this.baseUrl}post/comment/delete/${commentId}`, { headers });
  }


  // Method to get comments by post ID
  getCommentsByPostId(postId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.baseUrl}post/${postId}/comments`, { headers });
  }


}
