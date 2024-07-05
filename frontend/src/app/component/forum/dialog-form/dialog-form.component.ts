import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { matFormFieldAnimations, MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dialog-form',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, CommonModule, MatInputModule,CommonModule, FormsModule, MatButtonModule, MatDialogTitle,
            MatDialogContent, MatDialogActions, MatDialogClose, ],
  templateUrl: './dialog-form.component.html',
  styleUrl: './dialog-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class DialogFormComponent {
  file: File | null = null; // Variable to store file

  constructor(private http: HttpClient,
    public dialogRef: MatDialogRef<DialogFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  protected readonly value = signal('');

  protected onInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
  }

  // On file Select
  onChange(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.file = file;
    }
  }

  onUpload() {
    // if (this.file) {
    //   const formData = new FormData();
  
    //   formData.append('file', this.file, this.file.name);
  
    //   const upload$ = this.http.post("https://httpbin.org/post", formData);
  
    //   this.status = 'uploading';
  
    //   upload$.subscribe({
    //     next: () => {
    //       this.status = 'success';
    //     },
    //     error: (error: any) => {
    //       this.status = 'fail';
    //       return throwError(() => error);
    //     },
    //   });
    // }
  }
}