import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddPostComponent } from '../tools/add-post/add-post.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PostComponent } from '../tools/post/post.component';
import { UserService } from '../../_service/user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, PostComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  user: any;

  constructor(private userService: UserService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.user = this.userService.getUser();
    console.log(this.user);
  }

  onCreatePostClick(){
    this.dialog.open(AddPostComponent);
  }
}
