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
          this.userService.logout();
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

  logout(){
    this.userService.logout();
  }

}
