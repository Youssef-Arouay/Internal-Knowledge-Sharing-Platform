import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppmenuComponent } from './component/layout/appmenu/appmenu.component';
import { UserService } from './_service/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,AppmenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'frontend';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
      this.userService.fetchUserInfo();
  }


}
