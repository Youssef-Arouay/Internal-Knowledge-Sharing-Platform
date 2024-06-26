import { Component, DoCheck, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UserService, menu } from '../../../_service/user.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-appmenu',
  standalone: true,
  imports: [MaterialModule, RouterOutlet, RouterLink],
  templateUrl: './appmenu.component.html',
  styleUrl: './appmenu.component.css'
})
export class AppmenuComponent implements OnInit, DoCheck {

  constructor(private toastr: ToastrService, private service: UserService, private router: Router) {

  }

  showmenu = false;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // let userrole = localStorage.getItem('userrole') as string;
    //   this.service.Loadmenubyrole(userrole).subscribe(item => {
    //     this.menulist = item;
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
