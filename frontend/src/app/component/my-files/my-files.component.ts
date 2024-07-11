import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { PostCardComponent } from '../tools/post-card/post-card.component';

@Component({
  selector: 'app-my-files',
  standalone: true,
  imports: [CommonModule, MatTabsModule, PostCardComponent],
  templateUrl: './my-files.component.html',
  styleUrl: './my-files.component.css'
})
export class MyFilesComponent {

}
