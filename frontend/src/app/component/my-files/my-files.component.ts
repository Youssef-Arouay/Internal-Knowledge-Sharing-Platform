import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { PostCardComponent } from '../tools/post-card/post-card.component';
import { usercred } from '../../_model/user.model';
import { InteractionService } from '../../_service/interaction.service';
import { UserService } from '../../_service/user.service';
import { MyPostsResp, Post } from '../../_model/post.model';
import { PostService } from '../../_service/post.service';
import {MatChipsModule} from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { FileElement } from '../../_model/file.model';
import { MatButtonModule } from '@angular/material/button';
import { FileService } from '../../_service/file.service';

@Component({
  selector: 'app-my-files',
  standalone: true,
  imports: [CommonModule, MatTabsModule, PostCardComponent, MatCardModule,MatChipsModule, MatButtonModule],
  templateUrl: './my-files.component.html',
  styleUrl: './my-files.component.css'
})
export class MyFilesComponent implements OnInit {

  user : usercred | null = null;
  savedPosts: Post[] = []; // Array to hold saved posts
  myPosts: Post[] = [];
  myFiles: FileElement[] = []; // Array to hold user's files

  constructor(
    private fileService: FileService,
    private postService: PostService,
    private userService: UserService,
    private interactionService: InteractionService,
    private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      this.user = user;
      this.fetchSavedPosts();
      this.fetchMyPosts();
      this.fetchUserFiles();
    });
  }

  // Get saved posts of the user
  fetchSavedPosts(): void {
    this.interactionService.getSavedPosts().subscribe({
      next: (resp) => {

        //console.log("posts", posts)
        
        this.savedPosts = resp.$values;
        this.savedPosts.reverse();

        this.cdr.detectChanges(); // Ensure the view is updated
      },
      error: (error:any) => {
        console.error('Error fetching saved posts:', error);
      }
    });
  }

  // get user's post(s)
  fetchMyPosts(): void {
    this.postService.getMyPosts().subscribe({
      next: (response) => {
        this.myPosts = response.$values; // Assign the posts to the local variable
        this.myPosts.reverse();
        this.cdr.detectChanges(); // Ensure the view is updated
      },
      error: (error) => {
        console.error('Error fetching my posts:', error);
      }
    });
  }

  // Fetch user files
  fetchUserFiles(): void {
    this.postService.getUserFiles().subscribe({
      next: (files) => {
        this.myFiles = files.$values;
        this.cdr.detectChanges(); // Ensure the component updates
        console.log("this.myFiles :", this.myFiles);
      },
      error: (error) => {
        console.error('Error fetching user files:', error);
      }
    });
  }

  deleteFile(fileId: number): void {
    if (confirm('Are you sure you want to delete this file?')) {
      this.fileService.deleteFile(fileId).subscribe({
        next: (response) => {
          console.log('File deleted successfully', response);
          this.myFiles = this.myFiles.filter(file => file.id !== fileId);
        },
        error: (error) => {
          console.error('Error deleting file', error);
        }
      });
    }
  }
}
