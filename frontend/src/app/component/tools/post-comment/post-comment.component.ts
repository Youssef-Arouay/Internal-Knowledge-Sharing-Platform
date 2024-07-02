import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { InteractionService } from '../../../_service/interaction.service';
import { FormsModule } from '@angular/forms';
import { postCommentReq } from '../../../_model/user.model';

@Component({
  selector: 'app-post-comment',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './post-comment.component.html',
  styleUrl: './post-comment.component.css'
})
export class PostCommentComponent implements OnInit {
  @Input() post: any;  // Assuming 'post' is passed as an input to the component
  @Input() postId!: number; // Get the postId as an input property
  commentContent: string = '';
  show: boolean = true;
  comments: any[] = [];

  //////*
  displayedComments: any[] = [];
  batchSize: number = 3;
  loadedCommentsCount: number = 0;
  /////


  constructor(private interactionService: InteractionService) {}

  ngOnInit(): void {
    this.loadComments();
  }

  handleComment() {
    if (this.commentContent.trim()) {
      const comment: postCommentReq = {
        postId: this.postId.toString(),
        content: this.commentContent
      };

      this.interactionService.addComment(comment).subscribe({
        next: (response: any) => {
          console.log('Comment added successfully, response:', response);
          this.commentContent = "" ; // Reset the input field
        },
        error: (error: any) => {
          console.error('Error adding comment', error);
        }
      });
    } else {
      alert('Comment content cannot be empty');
    }
  }

  // loadComments() {
  //   this.interactionService.getCommentsByPostId(this.postId).subscribe({
  //     next: (response: any) => {
  //       console.log('Comments fetched successfully, response:', response);
  //       this.comments = response.$values; // Adjust based on actual response structure
  //     },
  //     error: (error: any) => {
  //       console.error('Error fetching comments', error);
  //     }
  //   });
  // }

  loadComments() {
    this.interactionService.getCommentsByPostId(this.postId).subscribe({
      next: (response: any) => {
        console.log('Comments fetched successfully, response:', response);
        this.comments = response.$values; // Adjust based on actual response structure
        this.loadNextBatch();
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
    }
  }

  onLoadMoreClick() {
    this.loadNextBatch();
  }

  toggleComments() {
    this.show = !this.show;
  }
}