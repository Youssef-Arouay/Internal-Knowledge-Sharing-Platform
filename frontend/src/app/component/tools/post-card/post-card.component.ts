import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TestComponent } from '../test/test.component';
import { PostCommentComponent } from '../post-comment/post-comment.component';
import { CommonModule } from '@angular/common';
import { PostService } from '../../../_service/post.service';
import { usercred } from '../../../_model/user.model';
import { UserService } from '../../../_service/user.service';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { InteractionService } from '../../../_service/interaction.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [MatIconModule,TestComponent, PostCommentComponent, CommonModule, MatMenuModule, MatMenuTrigger, MatTooltipModule],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class PostCardComponent implements OnInit {
  
  @Input() post: any ; // Input property to receive post data from parent component
  
  @Output() postDeleted: EventEmitter<void> = new EventEmitter<void>();
  @Output() postLiked: EventEmitter<void> = new EventEmitter<void>();
  @Output() postUnliked: EventEmitter<void> = new EventEmitter<void>();

  show:boolean = false;

  user: usercred | null=null;

  isOwner : boolean = false; // Flag to indicate if current user is the owner of the post


  constructor(private cdr: ChangeDetectorRef, private dialog: MatDialog, private postService: PostService, private userService : UserService, private interactionService: InteractionService) { }


  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      this.user = user;
      this.updateIsOwner(); 
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

  getUserLikesTooltip(post: any): string {
    return post.likes.$values.map((like: any) => `${like.user.firstname} ${like.user.lastname}`).join(', ');
  }


}
