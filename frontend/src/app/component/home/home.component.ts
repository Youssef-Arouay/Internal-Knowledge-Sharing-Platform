import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddPostComponent } from '../tools/add-post/add-post.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PostComponent } from '../tools/post/post.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, PostComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {


  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    
  }

  onCreatePostClick(){
    this.dialog.open(AddPostComponent);
  }
}
