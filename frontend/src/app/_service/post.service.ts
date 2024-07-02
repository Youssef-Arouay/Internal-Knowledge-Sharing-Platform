import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';
import { postDetails } from '../_model/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private userService: UserService) { }


  // Methode to add a post 
  addPost(post: postDetails): Observable<postDetails> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<postDetails>(`${this.baseUrl}post/add`, post, { headers });
  }

   // Method to delete a post by ID
   deletePost(postId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete<any>(`${this.baseUrl}post/${postId}`, { headers });
  }

  // fetch all posts for home page 
  getAllPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}post/all`);
  }


  formatPostDate(creationDate: string | Date): string {
    if (!creationDate) return '';

    const seconds = Math.floor((+new Date() - +new Date(creationDate)) / 1000);

    // Calculate time difference in hours, days, and years
    const intervals = {
      'hour': 3600,
      'day': 86400,
      'year': 31536000
    };

    if (seconds < intervals.hour) {
      const minutes = Math.floor(seconds / 60);
      return minutes > 1 ? `${minutes} minutes ago` : '1 minute ago';
    } else if (seconds < intervals.day) {
      const hours = Math.floor(seconds / intervals.hour);
      return hours > 1 ? `${hours} hours ago` : '1 hour ago';
    } else {
      return new Date(creationDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  }
}
