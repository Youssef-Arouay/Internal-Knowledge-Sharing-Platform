import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFileAlt, faMapMarkerAlt, faPhotoVideo, faSmile, faTags } from '@fortawesome/free-solid-svg-icons';
import { postDetails } from '../../../_model/user.model';
import { PostService } from '../../../_service/post.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TagsInputComponent } from '../tags-input/tags-input.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-share-post',
  standalone: true,
  imports: [FontAwesomeModule, MatIconModule, MatFormField, FormsModule, TagsInputComponent, CommonModule],
  templateUrl: './share-post.component.html',
  styleUrl: './share-post.component.css'
})
export class SharePostComponent {
  photoVideoIcon = faPhotoVideo;
  tagIcon = faTags;
  locationIcon = faMapMarkerAlt;
  feelingsIcon = faSmile;
  documentIcon = faFileAlt;

  showTagsInput = false ;
  tags: string[] = [];

  @Output() postAdded: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('tagsInputRef') tagsInputRef!: TagsInputComponent;

  post: postDetails = { id: 0, description: '', tags: [], creationDate: '', };

  constructor(private postService: PostService, private router: Router) { }


  toggleTagsInput() {
    this.showTagsInput = !this.showTagsInput;
  }
  

  showTags(): void {
    const tags = this.tagsInputRef.getTags();
    console.log('Tags:', tags);

  }
  
  /////New Approch 
  addPost() {
    // correct time format 
    let currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 1);
    this.post.creationDate = currentDate.toISOString();    

    this.post.tags = this.tagsInputRef.getTags();
    console.log('Tags:', this.post.tags); // Debug log to verify tags
    this.postService.addPost(this.post).subscribe({
      next: (response: postDetails) => {
        console.log('Post added successfully', response);
        this.resetPost();  // Clear input fields
        this.post
        this.postAdded.emit();
        this.tagsInputRef.clearTagsInput(); // Clear tags input field

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
    this.post = { id: 0, description: '', tags: [], creationDate: '' };
  }

}
