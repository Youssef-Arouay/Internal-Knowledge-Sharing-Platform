import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { savedPostsResp } from '../_model/interaction.model';
import { MyPostsResp, postCommentReq } from '../_model/post.model';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private createAuthorizationHeader(contentType: string = 'application/json'): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': contentType
    });
  }


  likePost(postId: number): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.post<any>(`${this.baseUrl}post/like/${postId}`, {}, { headers });
  }

  unlikePost(postId: number): Observable<any> {
    const headers = this.createAuthorizationHeader();

    return this.http.delete<any>(`${this.baseUrl}post/unlike/${postId}`, { headers });
  }


  // Method to add a comment
  addComment(comment: postCommentReq): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = this.createAuthorizationHeader();

    return this.http.post<any>(`${this.baseUrl}post/comment/add`, comment, { headers });
  }

  deleteComment(commentId: number): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.delete<any>(`${this.baseUrl}post/comment/delete/${commentId}`, { headers });
  }


  // Method to get comments by post ID
  getCommentsByPostId(postId: number): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.get<any>(`${this.baseUrl}post/${postId}/comments`, { headers });
  }


  //SAVE & UNSAVE
  savePost(postId: number): Observable<savedPostsResp> {
    const headers = this.createAuthorizationHeader();  
    return this.http.post<savedPostsResp>(`${this.baseUrl}post/save/${postId}`, {}, { headers });   
  }
 
  unsavePost(postId: number): Observable<savedPostsResp> {
    const headers = this.createAuthorizationHeader();

    return this.http.delete<savedPostsResp>(`${this.baseUrl}post/unsave/${postId}`, { headers });
  }

  // Method to get saved posts for a user
  getSavedPosts(): Observable<MyPostsResp> {
    const headers = this.createAuthorizationHeader();

    return this.http.get<MyPostsResp>(`${this.baseUrl}post/saved`, { headers });
  }

}
