import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-reply',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './reply.component.html',
  styleUrl: './reply.component.css'
})
export class ReplyComponent {


  onSendClick(commentInput: HTMLInputElement){
    if(!(commentInput.value.length > 0)) return;
    // this.firestore.create(
    //   {
    //     path: ["Posts", this.postId, "PostComments"],
    //     data: {
    //       comment: commentInput.value,
    //       creatorId: AppComponent.getUserDocument().userId,
    //       creatorName: AppComponent.getUserDocument().publicName,
    //       timestamp: FirebaseTSApp.getFirestoreTimestamp()
    //     },
    //     onComplete: (docId) => {
    //       commentInput.value = "";
    //     }
    //   }
    // );
  }



}
