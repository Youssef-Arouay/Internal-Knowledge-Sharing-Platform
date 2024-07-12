import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PostCommentComponent } from '../post-comment/post-comment.component';
import { CommonModule } from '@angular/common';
import { PostService } from '../../../_service/post.service';
import { usercred } from '../../../_model/user.model';
import { UserService } from '../../../_service/user.service';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { InteractionService } from '../../../_service/interaction.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { savedPostsResp } from '../../../_model/interaction.model';
import { MyPostsResp } from '../../../_model/post.model';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [MatIconModule, PostCommentComponent, CommonModule, MatMenuModule, MatMenuTrigger, MatTooltipModule, MatDialogModule],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class PostCardComponent implements OnInit {

  @Input() post: any; // Input property to receive post data from parent component

  @Output() postDeleted: EventEmitter<void> = new EventEmitter<void>();
  @Output() postLiked: EventEmitter<void> = new EventEmitter<void>();
  @Output() postUnliked: EventEmitter<void> = new EventEmitter<void>();

  
  user: usercred | null = null;
  
  savedPosts: any[] = []; // Array to hold saved posts got in ngOnInit
  
  show: boolean = false;
  isOwner: boolean = false; // Flag to indicate if current user is the owner of the post
  isSaved: boolean = false

  constructor(private cdr: ChangeDetectorRef, private dialog: MatDialog, private postService: PostService,
    private userService: UserService, private interactionService: InteractionService) { }


  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      this.user = user;
      this.updateIsOwner();
      this.fetchSavedPosts();
    });
  }

  updateIsOwner() {
    if (this.user && this.post && this.user.id === this.post.userId) {
      this.isOwner = true; // Check if current user is the owner of the post.
    } else {
      this.isOwner = false;
    }
  }

  toggleShow() {
    this.show = !this.show;
  }

  // Method to check if current user has liked the post
  hasLiked(post: any): boolean {
    if (!this.user || !post.likes || !post.likes.$values) {
      return false; // Return false if user or likes data is not available
    }
    return post.likes.$values.some((like: any) => like.userId === this.user!.id);
  }

  // Methode to like and unlike a post
  handleLike(post: any): void {
    if (this.hasLiked(post)) {
      // Unlike the post
      this.interactionService.unlikePost(post.postId).subscribe({
        next: () => {
          post.likes.$values = post.likes.$values.filter((like: any) => like.userId !== this.user!.id);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error unliking post', err);
        }
      });
    } else {
      // Like the post
      this.interactionService.likePost(post.postId).subscribe({
        next: () => {
          post.likes.$values.push({ userId: this.user!.id });
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error liking post', err);
        }
      });
    }
    console.log("post.likes.$values: ", post.likes.$values)
  }

  formatPostDate(creationDate: string | Date): string {
    return this.postService.formatPostDate(creationDate);
  }

  // Method to delete a post
  deletePost() {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(this.post.postId).subscribe({
        next: (response: any) => {
          console.log('Post deleted successfully', response);
          this.postDeleted.emit();          // Handle post deletion in your application (remove from UI)
        },
        error: (error: any) => {
          console.error('Error deleting post', error);
        }
      });
    }
  }

  getUserLikesTooltip(post: any): string {
    return post.likes.$values
      .map((like: any) => `${like.user.firstname} ${like.user.lastname}`)
      .join(', ');
  }

  
  // Method to save a post
  // Combined method to save or unsave a post based on isSaved flag
  toggleSavePost() {
    if (this.user && this.post) {
      if (this.isSaved) {
        this.interactionService.unsavePost(this.post.postId).subscribe({
          next: (response: savedPostsResp) => {
            console.log('Post unsaved successfully', response);
            this.isSaved = false;
            this.cdr.detectChanges();
          },
          error: (error: any) => {
            console.error('Error unsaving post', error);
          }
        });
      } else {
        this.interactionService.savePost(this.post.postId).subscribe({
          next: (response: savedPostsResp) => {
            console.log('Post saved successfully', response);
            this.isSaved = true;
            this.cdr.detectChanges();
          },
          error: (error: any) => {
            console.error('Error saving post', error);
          }
        });
      }
    } else {
      console.error('Error getting user or post');
    }
  }

  fetchSavedPosts(): void {
    this.interactionService.getSavedPosts().subscribe({
      next: (response: MyPostsResp) => {
        this.savedPosts = response.$values; 
  
        // Check if the current post is saved
        this.isSaved = this.savedPosts.some(savedPost => savedPost.postId === this.post.postId);  
        this.cdr.detectChanges(); // Ensure the component updates
        // console.log("this.savedPosts :", this.savedPosts);
      },
      error: (error) => {
        console.error('Error fetching saved posts:', error);
      }
    });
  }
  
  
  
  

}
