import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PostComponent } from '../tools/post/post.component';
import { UserService } from '../../_service/user.service';
import { SharePostComponent } from '../tools/share-post/share-post.component';
import { PostCardComponent } from '../tools/post-card/post-card.component';
import { usercred } from '../../_model/user.model';
import { Router } from '@angular/router';
import { PostService } from '../../_service/post.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, PostComponent, SharePostComponent, CommonModule, PostCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  user!: usercred ;
  posts: any[] = [];


  constructor(private postService: PostService, private userService: UserService, 
    private router: Router, private dialog: MatDialog, private cdr: ChangeDetectorRef  // Inject ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fetchPosts();
  }
  
  fetchPosts() {
    this.postService.getAllPosts().subscribe({
      next: (response: any) => {
        if (response && response.$values) {
          // Sort posts by creationDate in descending order
          this.posts = response.$values.sort((a: any, b: any) => {
            return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime();
          });
          console.log('Posts fetched successfully', this.posts);
          this.cdr.detectChanges();  // Trigger change detection

        } else {
          console.error('Unexpected response format', response);
        }
      },
      error: (error: any) => {
        console.error('Error fetching posts', error);
      }
    });
  }
  

  onCreatePostClick(): void {
    this.dialog.open(SharePostComponent, { disableClose: true }).afterClosed().subscribe(() => {
      this.fetchPosts(); // Refresh posts after closing the dialog
    });
  }

  onPostAdded() {
    this.fetchPosts(); // Refresh posts after a new post is added
  }

  onPostDeleted(): void {
    this.fetchPosts(); // Refresh posts after a post is deleted
  }
  onPostLiked() : void {
    // Handle post liked event: Fetch updated posts or update specific post in `this.posts`
    this.fetchPosts();
  }

  onPostUnliked(): void {
    // Handle post unliked event: Fetch updated posts or update specific post in `this.posts`
    this.fetchPosts();
  }
}
