import { Component, DoCheck, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UserService, menu } from '../../../_service/user.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { usercred } from '../../../_model/user.model';

@Component({
  selector: 'app-appmenu',
  standalone: true,
  imports: [MaterialModule, RouterOutlet, RouterLink],
  templateUrl: './appmenu.component.html',
  styleUrl: './appmenu.component.css'
})
export class AppmenuComponent implements OnInit, DoCheck {

  user! :usercred ;


  constructor(private toastr: ToastrService, private userService: UserService, private router: Router) {

  }

  showmenu = false;

  // ngOnInit(): void {
  //   this.user = this.userService.getUser();
  //   console.log("this.user"); // Verify if user data is available here
  //   console.log(this.user); // Verify if user data is available here

  // }

  ngOnInit(): void {
    this.userService.getUserInfo().subscribe(
      (data: usercred) => {
        this.user = data;
      },
      (error) => {
        console.error('Error fetching user info', error);
      }
    );
  }

  ngDoCheck(): void {
    this.Setaccess();
  }


  Setaccess() {
    let currentUrl = this.router.url;
    if (currentUrl == '/register') {
      this.showmenu = false;
    } else {
      this.showmenu = true;
    }
  }

  logout() {
    // Clear user information from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    localStorage.clear;
    // Optionally clear cookies if needed
    this.clearCookies();
    console.log("Logged out successfully")
    
    // Navigate to the login or register page
    setTimeout(() => {
      this.router.navigateByUrl('/register');
    }, 200);
    // Show a logout success message
  }

  clearCookies(): void {
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    }
  }
}
