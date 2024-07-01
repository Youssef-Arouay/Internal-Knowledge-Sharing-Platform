import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TestComponent } from '../test/test.component';
import { PostCommentComponent } from '../post-comment/post-comment.component';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { PostService } from '../../../_service/post.service';
import { usercred } from '../../../_model/user.model';
import { UserService } from '../../../_service/user.service';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { InteractionService } from '../../../_service/interaction.service';
import { MatDialog } from '@angular/material/dialog';
import { SharePostComponent } from '../share-post/share-post.component';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [MatIconModule,TestComponent, PostCommentComponent, CommonModule, MatMenuModule, MatMenuTrigger],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css'
})
export class PostCardComponent implements OnInit {
  
  
  @Input() post: any; // Input property to receive post data from parent component

  show = false;

  user!: usercred ;

  constructor(private dialog: MatDialog, private postService: PostService, private userService : UserService, private interactionService: InteractionService) { }

  toggleShow() {
    this.show = !this.show;
  }

  ngOnInit(): void {
    // connected user info 
    this.userService.getUserInfo().subscribe({
      next: (data: usercred) => {
        this.user = data;
      },
      error: (error) => {
        console.error('Error fetching user info', error);
      }
    });
}


  hasLiked(post: any): boolean {
    const userId = this.user ? this.user.id : null; // Assuming user is already fetched
    return post.likes.$values.some((like: any) => like.userId === userId);
  }

  
  likePost(postId: number) {
    this.interactionService.likePost(postId).subscribe({
      next: (response: any) => {
        // Assuming the API returns updated post information
        const updatedPost = response; // Adjust according to your API response structure
  
        // Update the posts array to reflect the new like count
        const postIndex = this.post.findIndex((post: { postId: number; }) => post.postId === postId);
        if (postIndex !== -1) {
          this.post[postIndex] = updatedPost;
          console.log('Post liked successfully', updatedPost);
        }
      },
      error: (error: any) => {
        console.error('Error liking post', error);
      }
    });
  }
  

  unlikePost(postId: number) {
    this.interactionService.unlikePost(postId).subscribe({
      next: (response: any) => {
        // Assuming the API returns updated post information after unlike
        const updatedPost = response; // Adjust according to your API response structure
  
        // Update the post array to reflect the new like count
        const postIndex = this.post.findIndex((post: { postId: number; }) => post.postId === postId);
        if (postIndex !== -1) {
          this.post[postIndex] = updatedPost;
          console.log('Post unliked successfully', updatedPost);
        }
      },
      error: (error: any) => {
        console.error('Error unliking post', error);
      }
    });
  }
  

  formatPostDate(creationDate: string | Date): string {
    return this.postService.formatPostDate(creationDate);
  }
  
}
