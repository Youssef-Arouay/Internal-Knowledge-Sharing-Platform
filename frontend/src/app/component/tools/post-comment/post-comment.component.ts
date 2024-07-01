import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-comment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-comment.component.html',
  styleUrl: './post-comment.component.css'
})
export class PostCommentComponent implements OnInit {
  @Input() post: any;  // Assuming 'post' is passed as an input to the component

  users: any;  // Define type as per your user structure
  user: any = {};
  Like: string = '';  // Adjust type if necessary
  count: number = 0;
  Comments: any[] = [];
  commentwriting: string = '';
  show: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
   
  }

  async getUser() {
    try {
      const res: any = await this.http.get(`http://139.144.12.15:80/api/user/post/user/details/${this.post.user}`).toPromise();
      this.user = res.data;
    } catch (error) {
      console.log("Some error occurred:", error);
    }
  }

  // Function to update commentwriting property on input change
  setcommentwriting(value: string) {
    this.commentwriting = value;
  }


  

  async addComment() {
    const comment = {
      postid: this.post._id,
      username: this.users.other.username,
      comment: this.commentwriting,
      profile: this.users.other.profile || 'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    };

    try {
      const url = 'http://localhost:5000/api/post/comment/post';
      const headers = new HttpHeaders().set('Content-Type', 'application/json').set('token', this.users.accessToken);
      await this.http.put(url, comment, { headers }).toPromise();
      this.Comments.push(comment);  // Update local comments array
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  }

  handleComment() {
    this.addComment();
  }

  toggleComments() {
    this.show = !this.show;
  }
}