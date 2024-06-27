import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [MatCardModule,MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.css'
})
export class AddPostComponent implements OnInit {
  selectedImageFile!: File ;

  constructor() { }

  ngOnInit(): void {   
  }

  onPhotoSelected(photoSelector: HTMLInputElement) {
  // Check if photoSelector.files is not null and has at least one file
    if (photoSelector.files && photoSelector.files.length > 0) {
      this.selectedImageFile = photoSelector.files[0];

      let fileReader = new FileReader();
      fileReader.readAsDataURL(this.selectedImageFile);

      fileReader.addEventListener('loadend', ev => {
        if (fileReader.result) { // Check if result is not null
          let readableString = fileReader.result.toString();
          let postPreviewImage = document.getElementById('post-preview-image') as HTMLImageElement;
          postPreviewImage.src = readableString;
        } else {
          console.error('FileReader result is null.');
        }
      });
    } else {
      console.error('No file selected.');
    }
  }

  // onPhotoSelected(photoSelector: HTMLInputElement) {
  //   this.selectedImageFile = photoSelector.files![0];
  //   if(!this.selectedImageFile) return;
  //   let fileReader = new FileReader();
  //   fileReader.readAsDataURL(this.selectedImageFile);
  //   fileReader.addEventListener(
  //     "loadend",
  //     ev => {
  //       let readableString = fileReader.result!.toString();
  //       let postPreviewImage = <HTMLImageElement>document.getElementById("post-preview-image");
  //       postPreviewImage.src = readableString;
  //     }
  //   );
  // }


  // onPostClick(commentInput: HTMLTextAreaElement) {
  //   let comment = commentInput.value;
  //   if(comment.length <= 0 ) return;
  //   if(this.selectedImageFile) {
  //     this.uploadImagePost(comment);
  //   } else {
  //     this.uploadPost(comment);
  //   }
   
  // }

  // uploadImagePost(comment: string){
  //   let postId = this.firestore.genDocId();
  //   this.storage.upload(
  //     {
  //       uploadName: "upload Image Post",
  //       path: ["Posts", postId, "image"],
  //       data: {
  //         data: this.selectedImageFile
  //       },
  //       onComplete: (downloadUrl) => {
  //         this.firestore.create(
  //           {
  //             path: ["Posts", postId],
  //             data: {
  //               comment: comment,
  //               creatorId: this.auth.getAuth().currentUser.uid,
  //               imageUrl: downloadUrl,
  //               timestamp: FirebaseTSApp.getFirestoreTimestamp()
  //             },
  //             onComplete: (docId) => {
  //               this.dialog.close();
  //             }
  //           }
  //         );
  //       }
  //     }
  //   );
  // }


}
