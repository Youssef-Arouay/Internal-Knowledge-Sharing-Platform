import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { fileForm } from '../../../_model/user.model';
import { FileService } from '../../../_service/file.service';
import { ToastrService } from 'ngx-toastr';

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

  fileForm: fileForm = {
    file: null,
    fileName: '',
    description: '',
    version: '',
    tags: []
  };

  protected readonly value = signal('');

  constructor(private http: HttpClient, public dialogRef: MatDialogRef<DialogFormComponent>, private fileService: FileService, 
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any, ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  protected onInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
  }

  // On file Select
  onChange(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      //this.file = file;
      this.fileForm.file = file;
      console.log('File selected:', this.fileForm.file);
    }
  }

  onSubmit(): void {
    if (this.fileForm.file && this.fileForm.fileName && this.fileForm.description && this.fileForm.version) {
      const formData = new FormData();
      formData.append('formFile', this.fileForm.file);
      formData.append('entityName', this.fileForm.fileName);
      formData.append('description', this.fileForm.description);
      formData.append('tags', JSON.stringify(this.fileForm.tags));
      formData.append('version', this.fileForm.version);

      this.fileService.uploadFile(formData).subscribe({
        next: response => {
          console.log('File uploaded successfully', response);
          this.toastr.success('File uploaded successfully')
          this.dialogRef.close();
        },
        error: error => {
          console.error('Error uploading file:', error);
          this.toastr.error('An error occurred while uploading the file:' , error.message);
        },
        complete: () => {
          console.log('File upload request completed');
        }
      });
    } else {
      this.toastr.error('Please fill in all required fields and select a file.');

    }
  }

}