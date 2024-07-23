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
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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

  pdfUrl: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer, private cdr: ChangeDetectorRef, private dialog: MatDialog, private postService: PostService,
    private userService: UserService, private interactionService: InteractionService) { }


  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      this.user = user;
      this.updateIsOwner();
      this.fetchSavedPosts();
    });
    if (this.post && this.post.fileContent && this.isPdf(this.post.contentType)) {
      this.pdfUrl = this.sanitizePdfUrl(this.post.fileContent);
    }
  }
  isPdf(contentType: string): boolean {
    return contentType === 'application/pdf';
  }

  sanitizePdfUrl(base64String: string): SafeResourceUrl {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  openFileInNewTab(fileName: string, contentType: string, fileContent: string) {
  const byteCharacters = atob(fileContent);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: contentType });

  const newTabContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${fileName}</title>
      <style>
        body, html {
          margin: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        object, embed {
          width: 100%;
          height: 100%;
        }
      </style>
    </head>
    <body>
      <object type="${contentType}" data="${URL.createObjectURL(blob)}">
        <embed src="${URL.createObjectURL(blob)}" type="${contentType}" />
      </object>
    </body>
    </html>
  `;

  const newBlob = new Blob([newTabContent], { type: 'text/html' });
  const newTabURL = URL.createObjectURL(newBlob);

  window.open(newTabURL, '_blank');
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
      const user = {
          userId: this.user!.id,
          firstname: this.user!.firstname,
          lastname: this.user!.lastname
        }
      this.interactionService.likePost(post.postId).subscribe({
        next: () => {
          console.log('aaaapost.likes.$values', post.likes.$values)
          // post.likes.$values.push({ userId: this.user!.id });
          post.likes.$values.push({user });

          console.log('BBBpost.likes.$values', post.likes.$values)
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
        this.isSaved = this.savedPosts.some(savedPost => savedPost.postId === this.post.postId);  
        this.cdr.detectChanges(); // Ensure the component updates
      },
      error: (error) => {
        console.error('Error fetching saved posts:', error);
      }
    });
  }

  isImage(contentType: string): boolean {
    return contentType.startsWith('image/');
  }

}