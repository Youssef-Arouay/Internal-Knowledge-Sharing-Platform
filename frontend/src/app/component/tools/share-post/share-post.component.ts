import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFileAlt, faMapMarkerAlt, faPhotoVideo, faSmile, faTags } from '@fortawesome/free-solid-svg-icons';
import { usercred } from '../../../_model/user.model';
import { PostService } from '../../../_service/post.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TagsInputComponent } from '../tags-input/tags-input.component';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../_service/user.service';
import { ToastrService } from 'ngx-toastr';
import { postDetails } from '../../../_model/post.model';

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

  showTagsInput = false;
  tags: string[] = [];

  user?: usercred | null = null;
  selectedFile: File | null = null;

  @Output() postAdded: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('tagsInputRef') tagsInputRef!: TagsInputComponent;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;


  post: postDetails = { id: 0, description: '', tags: [], file: null };

  constructor(private toastr: ToastrService, private postService: PostService, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  toggleTagsInput() {
    this.showTagsInput = !this.showTagsInput;
  }

  showTags(): void {
    const tags = this.tagsInputRef.getTags();
    // console.log('Tags:', tags);
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
    console.log("this.selectedFile", this.selectedFile)
  }

  /////New Approch 
  // addPost() {
  //   this.post.tags = this.tagsInputRef.getTags();
  //   if (this.selectedFile) {
  //     this.post.file = this.selectedFile;
  //   }
  //   // console.log('Tags:', this.post.tags);
  //   if (this.post.description !== "") {
  //     // const formData : postDetails = null;
  //     // formData.description = this.post.description;

  //     // formData.append('description', this.post.description);
  //     // formData.append('tags', JSON.stringify(this.post.tags));
  //     // formData.append('creationDate', this.post.creationDate);

  //     // if (this.selectedFile) {
  //     //   formData.append('file', this.selectedFile);
  //     // }

  //     this.postService.addPost(this.post).subscribe({
  //       next: (response: postDetails) => {
  //         this.resetPost();  // Clear input fields
  //         this.postAdded.emit();
  //         this.tagsInputRef.clearTagsInput(); // Clear tags input field
  //         this.toastr.success('Post added');

  //       },
  //       error: (error: any) => {
  //         console.error('Error adding post', error);
  //         this.toastr.error('Error adding post');
  //       },
  //       complete: () => {
  //         console.log('Post request completed');
  //       }
  //     });
  //   } else {
  //     this.toastr.error('You can not share post with no content');
  //   }
  // }

  addPost() {
    // this.post.tags = this.tagsInputRef.getTags();
    const formData = new FormData();
    
    formData.append('Description', this.post.description);
    formData.append('Tags', JSON.stringify(this.tagsInputRef.getTags()));

    if (this.selectedFile) {
      formData.append('File', this.selectedFile);
    }
  
    
    if (this.post.description !== "") {
      this.postService.addPost(formData).subscribe({
        next: (response: postDetails) => {
          console.log('Post added successfully', response);
          this.resetPost();  // Clear input fields
          this.postAdded.emit();
          this.tagsInputRef.clearTagsInput(); // Clear tags input field
          this.toastr.success('Post added');
        },
        error: (error: any) => {
          console.error('Error adding post', error);
          this.toastr.error('Error adding post');
        },
        complete: () => {
          console.log('Post request completed');
        }
      });
    } else {
      this.toastr.error('You can not share post with no content');
    }
  }
  
  resetPost() {
    this.post = { id: 0, description: '', tags: [], file: null };
    this.selectedFile = null;
  }

}
