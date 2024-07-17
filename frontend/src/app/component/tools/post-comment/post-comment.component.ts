import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { InteractionService } from '../../../_service/interaction.service';
import { FormsModule } from '@angular/forms';
import {  usercred } from '../../../_model/user.model';
import { UserService } from '../../../_service/user.service';
import { postCommentReq } from '../../../_model/post.model';

@Component({
  selector: 'app-post-comment',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './post-comment.component.html',
  styleUrl: './post-comment.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class PostCommentComponent implements OnInit {
  @Input() post: any;  //  'post' is passed as an input to the component
  @Input() postId!: number; // Get the postId as an input property

  commentContent: string = '';
  show: boolean = true;
  comments: any[] = [];

  user: usercred | null = null;

  //////*
  displayedComments: any[] = [];
  batchSize: number = 3;
  loadedCommentsCount: number = 0;
  /////


  constructor(private cdr: ChangeDetectorRef, private interactionService: InteractionService, private userService: UserService,) {}

  ngOnInit(): void {
    this.loadComments();
    this.userService.user$.subscribe((user) => {
      this.user = user;
    });
    // console.log("user" , this.user);
  }

  handleComment() {
    if (this.commentContent.trim()) {
      const comment: postCommentReq = {
        postId: this.postId.toString(),
        content: this.commentContent
      };

      this.interactionService.addComment(comment).subscribe({
        next: (response: any) => {
          // console.log('Comment added successfully, response:', response);
          this.commentContent = "" ; // Reset the input field
          this.loadComments();
        },
        error: (error: any) => {
          console.error('Error adding comment', error);
        }
      });
    } else {
      alert('Comment content cannot be empty');
    }
  }

  loadComments() {
    this.interactionService.getCommentsByPostId(this.postId).subscribe({
      next: (response: any) => {
        this.comments = response.$values; // Adjust based on actual response structure
        console.log('Comments fetched successfully, this.comments:', this.comments);
        this.loadNextBatch();
        this.cdr.detectChanges();

      },
      error: (error: any) => {
        console.error('Error fetching comments', error);
      }
    });
  }

  loadNextBatch() {
    if (this.loadedCommentsCount < this.comments.length) {
      const endIndex = Math.min(this.loadedCommentsCount + this.batchSize, this.comments.length);
      const newComments = this.comments.slice(this.loadedCommentsCount, endIndex);
      this.displayedComments.push(...newComments);
      this.loadedCommentsCount = endIndex;

      this.cdr.detectChanges(); 
    }
  }

  onLoadMoreClick() {
    this.loadNextBatch();
  }

  toggleComments() {
    this.show = !this.show;
  }

  // deleteComment(commentId: number) {
  //   this.interactionService.deleteComment(commentId).subscribe({
  //     next: () => {
  //       // Remove the comment from the comments array
  //       this.comments = this.comments.filter(comment => comment.id !== commentId);
  //       // Reset displayedComments and loadedCommentsCount
  //       this.displayedComments = [];
  //       this.loadedCommentsCount = 0;
  //       // Load the updated batch of comments
  //       this.loadNextBatch();
  //       this.cdr.detectChanges(); 

  //     },
  //     error: (error: any) => {
  //       console.error('Error deleting comment', error);
  //     }
  //   });
  // }

  // Delete Comment
  deleteComment(commentId: number) {
    this.interactionService.deleteComment(commentId).subscribe({
      next: () => {
        // Remove the comment from the comments array
        this.comments = this.comments.filter(comment => comment.id !== commentId);
        // Reset displayedComments and loadedCommentsCount
        this.displayedComments = [];
        this.loadedCommentsCount = 0;
        // Reload comments and update UI
        this.loadComments();
      },
      error: (error: any) => {
        console.error('Error deleting comment', error);
      }
    });
  }
}