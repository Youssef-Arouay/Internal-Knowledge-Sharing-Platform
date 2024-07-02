import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

declare var $: any; // Declare $ to use jQuery


@Component({
  selector: 'app-tags-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tags-input.component.html',
  styleUrl: './tags-input.component.css'
})
export class TagsInputComponent implements AfterViewInit {

  @ViewChild('tagsInput', { static: true }) tagsInput!: ElementRef;
  tags: string = ''; // Property to hold the tags input

  constructor() { }


  ngAfterViewInit(): void {
    $(this.tagsInput.nativeElement).tagsinput();
    console.log(this.tags);

  }

  getTags(): string[] {
    // Retrieve tags using jQuery
    return $(this.tagsInput.nativeElement).tagsinput('items');
  }

  clearTagsInput() {
    $(this.tagsInput.nativeElement).tagsinput('removeAll');
  }
  
  
}