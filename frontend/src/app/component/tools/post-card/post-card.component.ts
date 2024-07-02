import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  styleUrl: './post-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class PostCardComponent implements OnInit {
  
  
  @Input() post: any; // Input property to receive post data from parent component
  @Output() postDeleted: EventEmitter<void> = new EventEmitter<void>();
  @Output() postLiked: EventEmitter<void> = new EventEmitter<void>();
  @Output() postUnliked: EventEmitter<void> = new EventEmitter<void>();

  show = false;

  user!: usercred ;

  isOwner = false; // Flag to indicate if current user is the owner of the post


  constructor(private dialog: MatDialog, private postService: PostService, private userService : UserService, private interactionService: InteractionService) { }

  toggleShow() {
    this.show = !this.show;
  }

  ngOnInit(): void {
    // connected user info 
    this.fetchUserInfo() ;
  }

  fetchUserInfo(): void {
    this.userService.getUserInfo().subscribe({
      next: (data: usercred) => {
        this.user = data;
        this.isOwner = this.user && this.post.userId === this.user.id;
      },
      error: (error) => {
        console.error('Error fetching user info', error);
      }
    });
  }


  hasLiked(post: any): boolean {
    if (!this.user || !post.likes || !post.likes.$values) return false;
    return post.likes.$values.some((like: any) => like.userId === this.user.id);
  }
  
  
  likePost(postId: number): void {
    this.interactionService.likePost(postId).subscribe({
      next: () => {
        // Assuming the API returns status code 200 upon success
        console.log('Post liked successfully');
        this.postLiked.emit(); // Emit event to notify parent component
        this.hasLiked(this.post);
      },
      error: (error: any) => {
        console.error('Error liking post', error);
      }
    });
  }
  

  unlikePost(postId: number): void {
    this.interactionService.unlikePost(postId).subscribe({
      next: () => {
        console.log('Post unliked successfully');
        this.postUnliked.emit(); // Emit event to notify parent component
        this.hasLiked(this.post);

      },
      error: (error: any) => {
        console.error('Error unliking post', error);
      }
    });
  }
  

  formatPostDate(creationDate: string | Date): string {
    return this.postService.formatPostDate(creationDate);
  }
  
  // Method to delete a post
  deletePost() {
    console.log('Deleting post with id:', this.post.postId); // Debugging log

    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(this.post.postId).subscribe({
        next: (response: any) => {
          console.log('Post deleted successfully', response);
          this.postDeleted.emit();

          // Handle post deletion in your application (e.g., remove from UI)
        },
        error: (error: any) => {
          console.error('Error deleting post', error);
        }
      });
    }
  }


}
