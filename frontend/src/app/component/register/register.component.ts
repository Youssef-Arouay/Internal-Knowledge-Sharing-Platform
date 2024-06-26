import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { loginReq, loginresp, userRegister, usercred } from '../../_model/user.model';
import { UserService } from '../../_service/user.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule, RouterLink, FormsModule, CommonModule,],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  isSignDivVisiable: boolean = false;

  constructor(private builder: FormBuilder, private userService: UserService,
    private toastr: ToastrService, private router: Router) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    localStorage.clear();
    this.clearCookies();

    console.log("localStorage cleared");
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


  _regform = this.builder.group({
    email: this.builder.control('', Validators.required),
    password: this.builder.control('', Validators.required),
    firstname: this.builder.control('', Validators.required),
    lastname: this.builder.control('', Validators.required),
    //username: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(5)])),
    //confirmpassword: this.builder.control('', Validators.required),
    // phone: this.builder.control('', Validators.required)
  })

  proceedregister() {
    if (this._regform.valid) {
      let _obj: userRegister = {
        firstname: this._regform.value.firstname as string,
        lastname: this._regform.value.firstname as string,
        email: this._regform.value.email as string,
        password: this._regform.value.password as string
      }

      this.userService.Userregistration(_obj).subscribe(response => {
        console.log(response)
        if (response.status == 200) {
          this.toastr.success('Registration completed', 'Registration');
          this._regform.reset();

          this.isSignDivVisiable = false; // Set isSignDivVisible to true
          //this.router.navigateByUrl('/register');
        } else {
          console.log(response);
          this.toastr.error('Failed due to : ' + response, 'Registeration Failed')
        }
      },
        (error) => {
          console.error('Error during registration:', error);
          this.toastr.error('Failed due to : ' + error.error.message, 'Registration Failed');
        }
      );

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
