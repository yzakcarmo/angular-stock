import { Component } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../../services/user/user.service";
import {SignupUserRequest} from "../../models/interfaces/user/SignupUserRequest";
import {CookieService} from "ngx-cookie-service";
import {AuthRequest} from "../../models/interfaces/user/auth/AuthRequest";
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";

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
    private cookieService: CookieService,
    private messageService: MessageService,
    private router: Router
  ) {}

  onSubmitLoginForm():void {
    if(this.loginForm.valid && this.signupForm.value){
      this.userService.authUser(this.loginForm.value as AuthRequest)
        .subscribe({
          next: (response) => {
            if(response) {
              this.cookieService.set('USER_INFO', response?.token);
              this.loginForm.reset();
              this.router.navigate(['/dashboard'])

              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: `Bem vindo de volta ${response?.name}!`,
                life: 2000
              })
            }
          },
          error: error => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro no login',
              life: 2000
            })
            console.log(error)},
        })
    }
  }

  onSubmitSignupForm():void {
    if(this.signupForm.valid && this.signupForm.value){
      this.userService.signupUser(this.signupForm.value as SignupUserRequest)
        .subscribe({
          next: (response) => {
            if(response) {
              this.signupForm.reset();
              this.loginCard = true;

              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Cadastro feito',
                life: 2000
              })
            }
          },
          error: error => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro no cadastro',
              life: 2000
            })
            console.log(error)},
        })
    }
  }
}
