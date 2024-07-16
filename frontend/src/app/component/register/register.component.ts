import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { loginReq, loginresp, userRegister, usercred } from '../../_model/user.model';
import { UserService } from '../../_service/user.service';
import { ToastrService } from 'ngx-toastr';
import { HttpResponse } from '@angular/common/http';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
import { environment } from '../../../environments/environment.development';


declare var google: any;
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule, RouterLink, FormsModule, CommonModule,],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  private clientId = environment.clientId;

  isSignDivVisible: boolean = false;

  constructor(private builder: FormBuilder, private userService: UserService, private _ngZone: NgZone,
    private toastr: ToastrService, private router: Router) {

  }

  ngOnInit(): void {
    // window.onGoogleLibraryLoad = () => {
    google.accounts.id.initialize({
      client_id: this.clientId,
      callback: this.handleCredentialResponse.bind(this),
      auto_select: false,
      cancel_on_tap_outside: true
    });
    google.accounts.id.renderButton(
      document.getElementById("google-btn"),
      {
        theme: 'filled_blue',
        size: 'large',
        shape: 'rectangle',
        width: 300
      });
    google.accounts.id.prompt((notification: PromptMomentNotification) => { });
    //}
  }

  async handleCredentialResponse(response: CredentialResponse) {
    this.userService.LoginGoogle(response.credential).subscribe({
      next: (resp: any) => {
        localStorage.setItem("token", resp.token);
        localStorage.setItem('user', JSON.stringify(resp.user));

        this.userService.setUser(resp.user); // Store user data in UserService

        console.log("resp", resp);
        this.toastr.success('Logged in successfully', 'Success');
        this._ngZone.runTask(() => {
          this.router.navigate(['/']);
        })
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  _regform = this.builder.group({
    firstname: this.builder.control('', Validators.required),
    lastname: this.builder.control('', Validators.required),
    email: this.builder.control('', Validators.required),
    password: this.builder.control('', Validators.required),
  })


  proceedregister() {
    if (this._regform.valid) {
      let _obj: userRegister = {
        firstname: this._regform.value.firstname as string,
        lastname: this._regform.value.lastname as string,
        email: this._regform.value.email as string,
        password: this._regform.value.password as string
      };

      this.userService.Userregistration(_obj).subscribe({
        next: response => {
          console.log(response);
          if (response.status === 200) {
            this.toastr.success('Registration completed', 'Registration');
            this._regform.reset();
            this.isSignDivVisible = false; 
          } else {
            this.toastr.error('Failed due to: ' + response, 'Registration Failed');
          }
        },
        error: error => {
          console.error('Error during registration:', error);
          this.toastr.error('Failed due to: ' + error.error.message, 'Registration Failed');
        },
        complete: () => {
          console.log('Registration request completed');
        }
      });
    } else {
      this.toastr.error('Please fill out the form correctly', 'Registration Failed');
    }
  }


  //////LOGIN////////
  _loginform = this.builder.group({
    email: this.builder.control('', Validators.required),
    password: this.builder.control('', Validators.required)
  })

  proceedLogin() {
    if (this._loginform.valid) {
      let loginObj: loginReq = {
        email: this._loginform.value.email as string,
        password: this._loginform.value.password as string,
      };

      this.userService.Proceedlogin(loginObj).subscribe(
        (response: HttpResponse<loginresp>) => {
          if (response.status === 200) {
            const responseData = response.body; // Assuming loginresp is returned as the body

            console.log(responseData)


            if (responseData && responseData.token && responseData.user) {
              localStorage.setItem('token', responseData.token);
              localStorage.setItem('user', JSON.stringify(responseData.user));

              this.userService.setUser(responseData.user); // Store user data in UserService

              console.log('User set in UserService:', this.userService.getUser());


              this.toastr.success('Logged in successfully', 'Success');
              setTimeout(() => {
                this.router.navigateByUrl('/dashboard');
              }, 750); // 1000 milliseconds = 1 second delay
            } else {
              this.toastr.error('Invalid credentials', 'Login Failed');
            }
          } else {
            this.toastr.error('Invalid response from server', 'Login Failed');
          }
        },
        (error) => {
          console.error('Error during login:', error);
          if (error.status === 401) {
            this.toastr.error('Invalid credentials', 'Login Failed');
          } else {
            this.toastr.error('Login Failed', 'Failed due to: ' + error.error.message);
          }
        }
      );
    } else {
      this.toastr.error('Please fill out the form correctly', 'Login Failed');
    }
  }

}
