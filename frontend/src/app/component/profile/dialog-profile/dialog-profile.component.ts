import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../../_service/user.service';
import { profileForm, usercred } from '../../../_model/user.model';
import { DialogFormComponent } from '../../forum/dialog-form/dialog-form.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-dialog-profile',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatDialogModule, MatFormFieldModule, CommonModule, MatInputModule, FormsModule, MatButtonModule, MatDialogTitle,
    MatDialogContent, MatDialogActions, MatDialogClose, MatDatepickerModule ],
  templateUrl: './dialog-profile.component.html',
  styleUrl: './dialog-profile.component.css'
})
export class DialogProfileComponent implements OnInit {

  user: usercred | null = null ;
  imageProfile: File | null = null; // Variable to store file

  profileForm: profileForm = {
    imageProfile: null,
    firstname: '',
    lastname: '',
    username: '',
    phoneNumber: '',
    birthDate:'',
    email: ''
  };

  protected readonly value = signal('');

  constructor(private userService: UserService, public dialogRef: MatDialogRef<DialogFormComponent> , @Inject(MAT_DIALOG_DATA) public data: any)
  {}

  ngOnInit(): void {
    // this.userService.user$.subscribe((user) => {
    //   this.user = user;
    //   });
    if (this.data) {
      this.profileForm = { ...this.data };
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  protected onInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
  }

  // On file Select
  onChange(event: any) {
    const imageProfile: File = event.target.files[0];
    if (imageProfile) {
      //this.file = file;
      this.profileForm.imageProfile = imageProfile;
      console.log('File selected:', this.profileForm.imageProfile);
    }
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('Firstname', this.profileForm.firstname || '');
    formData.append('Lastname', this.profileForm.lastname || '');
    formData.append('Username', this.profileForm.username || '');
    formData.append('PhoneNumber', this.profileForm.phoneNumber.toString() || '');
    formData.append('BirthDate', this.profileForm.birthDate || '');
    if (this.profileForm.imageProfile) {
        formData.append('ProfileImage', this.profileForm.imageProfile);
    } else {
        formData.append('ProfileImage', '');
    }

    // Log FormData for debugging
    formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
    });

    this.userService.updateProfile(formData).subscribe({
        next: (response) => {
            console.log('Profile updated successfully:', response);
            this.dialogRef.close();
        },
        error: (error) => {
            console.error('Error updating profile:', error);
        }
    });
}


}
