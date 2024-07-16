import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../../_service/user.service';
import { usercred } from '../../_model/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user? : usercred | null ;
  
  constructor(private userService: UserService) { }


  // name = JSON.parse(sessionStorage.getItem("loggedInUser")!).name ;

  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      this.user = user;
      console.log(user)
    });
  }
  
}
