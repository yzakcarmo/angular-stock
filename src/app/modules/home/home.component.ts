import { Component } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../../services/user/user.service";
import {SignupUserResponse} from "../../models/interfaces/user/SignupUserResponse";
import {SignupUserRequest} from "../../models/interfaces/user/SignupUserRequest";
import {CookieService} from "ngx-cookie-service";
import {AuthRequest} from "../../models/interfaces/user/auth/AuthRequest";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  loginCard = true;

  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  })

  signupForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
  })

  constructor(
    private formBuilder:FormBuilder,
    private userService: UserService,
    private cookieService: CookieService
  ) {}

  onSubmitLoginForm():void {
    if(this.loginForm.valid && this.signupForm.value){
      this.userService.authUser(this.loginForm.value as AuthRequest)
        .subscribe({
          next: (response) => {
            if(response) {
              this.cookieService.set('USER_INFO', response?.token);
              alert('Usuario Logado');
              this.loginForm.reset();
            }
          },
          error: error => {console.log(error)},
        })
    }
  }

  onSubmitSignupForm():void {
    if(this.signupForm.valid && this.signupForm.value){
      this.userService.signupUser(this.signupForm.value as SignupUserRequest)
        .subscribe({
          next: (response) => {
            if(response) {
              alert('Usuario Criado');
              this.signupForm.reset();
              this.loginCard = true;
            }
          },
          error: error => {console.log(error)},
        })
    }
  }
}
