import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent implements OnInit {
  @Input() post: any;
  user$: Observable<any> | undefined;
  user: any;
  postUser: any = {};
  Like: string | undefined;
  count: number | undefined;
  Comments: any[] | undefined;
  commentwriting: string = '';
  show: boolean = false;

  constructor(private http: HttpClient) {
  }
  samplePost = {
    _id: '1',
    user: 'user_id_1',
    title: 'Sample Post Title',
    image: 'https://www.google.com/imgres?q=avatar%20icon&imgurl=https%3A%2F%2Fcdn-icons-png.freepik.com%2F512%2F147%2F147144.png&imgrefurl=https%3A%2F%2Fwww.freepik.com%2Ficon%2Favatar_147144&docid=Bn1wu54aoDBJ7M&tbnid=koR5k7ff7vqzMM&vet=12ahUKEwjl_trIroGHAxX4_7sIHb_VAXAQM3oECH8QAA..i&w=512&h=512&hcb=2&ved=2ahUKEwjl_trIroGHAxX4_7sIHb_VAXAQM3oECH8QAA',
    like: ['user_id_2', 'user_id_3'],
    comments: [
      { username: 'user1', comment: 'Great post!', profile: 'https://example.com/profile.jpg' },
      { username: 'user2', comment: 'Nice job!', profile: 'https://example.com/profile2.jpg' }
    ]
  };
  ngOnInit(): void {
    this.user$!.subscribe(userDetails => {
      this.user = userDetails?.user;
      this.initializePost();
    });

    this.getUserDetails();
  }

  getUserDetails() {
    this.http.get(`http://139.144.12.15:80/api/user/post/user/details/${this.post.user}`)
      .subscribe({
        next: (res: any) => this.postUser = res,
        error: () => console.log("Some error occurred")
      });
  }

  initializePost() {
    const userId = this.user.other._id;
    this.Like = this.post.like.includes(userId) ? 'assets/setLike.png' : 'assets/like.png';
    this.count = this.post.like.length;
    this.Comments = this.post.comments;
  }

  handleLike() {
    const accessToken = this.user.accessToken;
    const headers = { 'Content-Type': 'application/Json', token: accessToken };
    const url = `http://localhost:5000/api/post/${this.post._id}/like`;

    this.http.put(url, {}, { headers }).subscribe(() => {
      if (this.Like === 'assets/like.png') {
        this.Like = 'assets/setLike.png';
        this.count! += 1;
      } else {
        this.Like = 'assets/like.png';
        this.count! -= 1;
      }
    });
  }

  addComment() {
    const accessToken = this.user.accessToken;
    const comment = {
      postid: this.post._id,
      username: this.user.other.username,
      comment: this.commentwriting,
      profile: this.user.other?.profile
    };
    const headers = { 'Content-Type': 'application/Json', token: accessToken };

    this.http.put('http://localhost:5000/api/post/comment/post', comment, { headers })
      .subscribe(() => {
        this.Comments = [...this.Comments!, comment];
      });
  }

  handleComment() {
    this.addComment();
  }

  toggleComments() {
    this.show = !this.show;
  }
}