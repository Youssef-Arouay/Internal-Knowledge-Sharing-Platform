import { Component, EventEmitter, Output } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFileAlt, faMapMarkerAlt, faPhotoVideo, faSmile, faTags } from '@fortawesome/free-solid-svg-icons';
import { postDetails } from '../../../_model/user.model';
import { PostService } from '../../../_service/post.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-share-post',
  standalone: true,
  imports: [FontAwesomeModule, MatIconModule, MatFormField, FormsModule,],
  templateUrl: './share-post.component.html',
  styleUrl: './share-post.component.css'
})
export class SharePostComponent {
  photoVideoIcon = faPhotoVideo;
  tagIcon = faTags;
  locationIcon = faMapMarkerAlt;
  feelingsIcon = faSmile;
  documentIcon = faFileAlt;


  @Output() postAdded: EventEmitter<void> = new EventEmitter<void>();

  post: postDetails = { id: 0, description: '', tags: '', creationDate: '' };

  constructor(private postService: PostService, private router: Router) { }


  //Old approch
  // addPost() {
  //     this.post.creationDate = new Date().toISOString();  // Set the creationDate to the current date and time
  //   this.postService.addPost(this.post).subscribe(
  //     response => {
  //       console.log('Post added successfully', response);
  //     },
  //     error => {
  //       console.error('Error adding post', error);
  //     }
  //   );
  // }


  /////New Approch 
  addPost() {
    // correct time format 
    let currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 1);
    this.post.creationDate = currentDate.toISOString();    
    console.log(this.post.creationDate);

    this.postService.addPost(this.post).subscribe({
      next: (response: postDetails) => {
        console.log('Post added successfully', response);
        this.resetPost();  // Clear input fields
        this.postAdded.emit();
        this.router.navigate(['/']);
      },
      error: (error: any) => {
        console.error('Error adding post', error);
      },
      complete: () => {
        console.log('Post request completed');
      }
    });
  }


  resetPost() {
    this.post = { id: 0, description: '', tags: '', creationDate: '' };
  }
}
