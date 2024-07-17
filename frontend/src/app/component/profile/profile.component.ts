import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../../_service/user.service';
import { usercred } from '../../_model/user.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogProfileComponent } from './dialog-profile/dialog-profile.component';
import { DialogFormComponent } from '../forum/dialog-form/dialog-form.component';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,DialogProfileComponent, MatDialogModule,
    DialogFormComponent,
    MaterialModule,
    ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user? : usercred | null ;
  
  constructor(private userService: UserService,    public dialog: MatDialog,  ) { }


  // name = JSON.parse(sessionStorage.getItem("loggedInUser")!).name ;

  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      this.user = user;
      console.log(user)
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogProfileComponent, {
      data: this.user
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
  
}
