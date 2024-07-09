import { Component, DoCheck, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UserService } from '../../../_service/user.service';
import { usercred } from '../../../_model/user.model';
import { catchError, of } from 'rxjs';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-appmenu',
  standalone: true,
  imports: [MaterialModule, RouterOutlet, RouterLink, TitleCasePipe],
  templateUrl: './appmenu.component.html',
  styleUrl: './appmenu.component.css'
})
export class AppmenuComponent implements OnInit, DoCheck {
 
  capitalizeFirstLetter(value: string | undefined) {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
  }


user: usercred | null = null;

constructor(private userService: UserService, private router: Router) { }

showmenu = false;

// Old Simple NgOnInit call 
// ngOnInit(): void {
//   this.userService.user$.subscribe((user) => {
//     this.user = user;
//   });
// }

//New implementation
ngOnInit(): void {
  this.userService.user$.pipe(
    catchError((error) => {
      if (error.status === 401) {
        this.logout();
      }
      return of(null); // Return a null observable or handle as needed
    })
  ).subscribe((user) => {
    this.user = user;
  });
}

ngDoCheck(): void {
  this.Setaccess();
}


Setaccess() {
  let currentUrl = this.router.url;
  if (currentUrl == '/register' || currentUrl == '/resetpassword') {
    this.showmenu = false;
  } else {
    this.showmenu = true;
  }
}

logout() {
  this.userService.clearUser();
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

  for(let i = 0; i <cookies.length; i++) {
  const cookie = cookies[i];
  const eqPos = cookie.indexOf('=');
  const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
  document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
}
  }
}
