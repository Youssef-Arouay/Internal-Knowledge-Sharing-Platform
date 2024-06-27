import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ReplyComponent } from '../reply/reply.component';
import { AddPostComponent } from '../add-post/add-post.component';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [MatCardModule, MatIconModule, AddPostComponent],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent {

  @Input() postData: any;


  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    
  }


  onReplyClick(){
    // this.dialog.open(ReplyComponent, {data: this.postData.postId});
    this.dialog.open(ReplyComponent);

  }


}
